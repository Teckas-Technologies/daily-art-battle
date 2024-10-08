"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import { uploadFile, uploadReference } from '@mintbase-js/storage';
import { useMbWallet } from "@mintbase-js/react";
import { useSaveData, ArtData } from "../hooks/artHooks";
import { Button } from './ui/button';
import { useFetchImage } from "../hooks/testImageHook";
import Badge from '../../public/images/badge.png';
import { useFetchGeneratedImage } from "../hooks/generateImageHook";
import Toast from './Toast'; 
import campaign from '../../model/campaign';
interface Artwork {
  name: string;
  file: File | null|undefined;
  fileName: string;
  previewUrl:string|null;
}

interface ArtworkUploadFormProps {
  onClose: () => void;
  onSuccessUpload: () => void; 
  campaignId:string
}

export const ArtworkUploadForm: React.FC<ArtworkUploadFormProps> = ({ onClose, onSuccessUpload ,campaignId}) => {
  const defaultArtworks: Artwork[] = [
    { name: 'Upload Unique Rare', file: null, fileName: '',previewUrl: ''  },
  ];
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [artTitle, setArtTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { saveData } = useSaveData();
  const [isFormValid, setIsFormValid] = useState(false);
  const {image,fetchImage} = useFetchImage();
  const [imageCreating, setImageCreating] = useState(false);
  const { imageUrl,file, fetchGeneratedImage,error } = useFetchGeneratedImage();  
  const [prompt, setPrompt] = useState(false);
  const[choose,setFileChoosen] = useState(false);
  const[imageChoose,setImageChoosen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const[disable,setDisable]=useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null); 
  const[imageError,setImageError] = useState(false);
  const[toast,setToast] = useState(true);


  const handleFileChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const newArtworks = [...artworks];
    if (file) {
      newArtworks[index] = { ...newArtworks[index], file, fileName: file.name, previewUrl:'' };
    } else {
      newArtworks[index] = { ...newArtworks[index], file: null, fileName: '' ,previewUrl: '' };
    }
    setArtworks(newArtworks);
  };

  const handleArtName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setArtTitle(name);
  };



  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    setImageError(false);
  };
  
  const handlePrompt = () => {
    const newArtworks = [...artworks];
    newArtworks[0] = { ...newArtworks[0], file: null, fileName: '' ,previewUrl: '' };
    setArtworks(newArtworks); 
    setDisable(true)
    setMessage('');
    setPrompt(true);
  }

  const handleClosePrompt = (event: React.MouseEvent) => {
     setDisable(false);
     setImageError(false);
    event.preventDefault(); 
    setPrompt(false);
    setMessage('');
  }


  const handleCloseImage = (event: React.MouseEvent) => {
    event.preventDefault(); 
    const newArtworks = [...artworks];
    newArtworks[0] = { ...newArtworks[0], previewUrl: null }; // Set previewUrl to null
    setArtworks(newArtworks); // Update artworks state
    setPrompt(true);
    setMessage('');
  }


  const handleCreate = async (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent form submission
    setImageCreating(true);

    const res = await fetchGeneratedImage(message);
    if (res) {
      const newArtworks = [...artworks];
      newArtworks[0] = { ...newArtworks[0], previewUrl: res?.imageUrl,file:res.file };
      setImageChoosen(false);
      setArtworks(newArtworks); 
      setPrompt(false);
      setImageCreating(false);
      }else{
        console.error("error");
        setImageError(true);
        setImageCreating(false);  
       
      }
   
  }

  const handleChoosenImage = async (event: React.MouseEvent) => {
    event.preventDefault();
    setDisable(false);
    setFileChoosen(true);
    setImageChoosen(true);

    const newArtworks = [...artworks];
    const previewUrl = newArtworks[0].previewUrl;

    if (!previewUrl) {
        console.error('No preview image URL available');
        return;
    }

    try {

        newArtworks[0] = { ...newArtworks[0], fileName:'Generated image' };
        setArtworks(newArtworks);
        setFileChoosen(false);
        setPrompt(false);
    } catch (error) {
        console.error('Error converting preview URL to file:', error);
    }
};








  
useEffect(() => {
  const isFirstFileUploaded = artworks[0]?.file !== null;
  setIsFormValid(isFirstFileUploaded && artTitle.trim() !== "");
}, [artworks, artTitle]);




  const uploadArtWork = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isConnected || !activeAccountId) {
      connect();
      return;
    }
    setUploading(true);
   
    try {
      const artBattle: Partial<ArtData> = { artistId: activeAccountId };
      if (artworks.length < 1) {
        alert("Please Upload All files");
        return;
      }
      
      artBattle.arttitle = artTitle;
      
      for (const artwork of artworks) {
        if (!artwork.file) {
          alert(`Missing file for ${artwork.name}`);
          return;
        }
        if(artwork.file.size>30000000){
          setToastMessage(`The file size should be less than 30 MB`);
          setToast(false);
          return;
        }
        console.log(artwork.file.size);
        const uploadResult = await uploadFile(artwork.file);
        const url = `https://arweave.net/${uploadResult.id}`;
        const metadata = {
          title: "Art Battle",
          media: artwork.file
        }
        const referenceResult = await uploadReference(metadata);
        const referenceUrl = `https://arweave.net/${referenceResult.id}`;
        switch (artwork.name) {
          case 'Upload Unique Rare':
            artBattle.colouredArt = url;
            artBattle.colouredArtReference = referenceUrl;
            break;
          // case 'Upload Derivative Edition':
          //   artBattle.grayScale = url;
          //   artBattle.grayScaleReference = referenceUrl;
          //     break;
          default:
            break;
        }
      }
      artBattle.campaignId = campaignId;
      await saveData(artBattle as ArtData);
      setToastMessage('All files uploaded successfully');
      setToast(true)
      onSuccessUpload();
     setTimeout(()=>{onClose();},2000)
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please check the files and try again.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="navbar fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ width: '100vw' }}>
      <div className="bg-white p-4 rounded-lg" style={{ backgroundColor: '#101011f0',maxWidth: '330px', border: '2px dotted #3deb34', height: 'auto' , position: 'relative', maxHeight: '95vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
        <h2 className="text-lg font-bold mb-2 text-center" style={{ color: '#3deb34', paddingBottom: 6, borderBottom: '1.5px solid white', fontSize: 18 }}>Upload Artwork</h2>
       
        <form onSubmit={uploadArtWork}>
        {toastMessage && (
        <Toast success={toast} message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
          {artworks.map((artwork, index) => (
            <div key={index} className='mb-1'>
              {index === 0 && (
                <>
                  <label className="block text-sm font-medium text-gray-900 break-words py-2" style={{ fontWeight: 500, fontSize: 13, color: '#fff', maxWidth: '300px' }}>
                    Upload the highest quality version of your art as the 'Unique Rare'. This version will be minted as a single edition (1:1) and awarded to one lucky winner who picks your art in a battle! This is the version which will be displayed on our site for user to upvote and pick in battle.
                  </label>
                  {!disable && (
                  <label
                    htmlFor={`fileInput-${index}`}
                    className={` bg-white text-sm text-gray-900 rounded-lg focus:outline-none pb-2 mt-2 ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{
                      padding: 5,
                      border: 'none',
                      color: '#000',
                      fontSize: 13,
                    }}
                  >

                    {artwork.name}
                  </label>
                  )}
                  <input  className={` hidden ${disable ? 'cursor-not-allowed' : ''}`} disabled={disable} type="file"  id={`fileInput-${index}`}  onChange={handleFileChange(index)} />
                  <span className={`px-3 text-sm text-gray-600 ${disable ? 'cursor-not-allowed' : ''}`} style={{ maxWidth: '300px', wordBreak: 'break-all', whiteSpace: 'normal' }}>
                {artwork.fileName}
              </span>
              {!disable && (
                 <button  disabled={disable} onClick={handlePrompt} className={`text-sm mt-3 rounded-lg text-gray-900 bg-white pb-1  ${disable ? 'cursor-not-allowed hidden' : 'cursor-pointer'}`}  style={{
                      padding: 4,
                      border: 'none',
                      color: '#000',
                      fontSize: 13
                    }}>Generate using AI</button>
                  )}
                 {prompt &&(
                 <>
                 <label htmlFor="message" className="mt-3 block mb-2 break-words text-sm font-medium text-red-500 dark:text-white">
                   Image generation will take one minute.
                 </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={handleMessageChange}
                    className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${imageError ? 'textarea-error' : ''}`}
                    placeholder="Write your thoughts here..."
                  ></textarea>
                  {imageError && <label className="text-sm font-medium error-message">Please enter valid thoughts for image generation.</label>}
                  
               </>
                    )}
                  {(artwork.previewUrl && !imageChoose)&& (
                    <div className='ml-10'>
                    <img src={artwork.previewUrl} alt="Preview" className="mt-2 mb-4" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '4px' }} />
                    <button
                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={handleCloseImage}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleChoosenImage}
                  >
                    {choose ? 'Processing...' : 'Choose'}
                  </button>
                  </div>
                )}
                   {prompt &&(
                  <div className="mt-4 px-4 flex justify-end">
                  <button
                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={handleClosePrompt}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleCreate}
                  >
                      {imageCreating ? 'Generating...' : 'Generate'}
                  </button>
               </div>
                  )}
                </>
              )}
              <br></br>
            </div>
          ))}
          <hr ></hr>

          <div className='mb-1'>
            <label className="mt-4 block text-sm font-medium text-gray-900 break-words" style={{ fontWeight: 500, fontSize: 13, color: '#fff', maxWidth: '300px' }}>
              Art Title. This name will appear in association with your artwork on this site and in your fans' wallets.
            </label>
            <input
              type="text"
              onChange={handleArtName}
              className="block text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
              style={{ padding: 5, border: 'none', color: '#000', fontSize: 13 }}
            />
          </div>

          <div className="mt-2 space-x-3 flex justify-end">
            <Button type="button" onClick={onClose} className=" cancel-btn text-white px-4 py-2 rounded">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || uploading}
              className={`mr-2 upload-btn text-white px-4 py-2 rounded ${!isFormValid || uploading ? 'cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Processing...' : 'Upload'}
            </Button>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default ArtworkUploadForm;