"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import { uploadFile, uploadReference } from '@mintbase-js/storage';
import { useMbWallet } from "@mintbase-js/react";
import { useSaveData, ArtData } from "../hooks/artHooks";
import { Button } from './ui/button';
import { useFetchImage } from "../hooks/testImageHook";
import Badge from '../../public/images/badge.png';
import { useFetchGeneratedImage } from "../hooks/generateImageHook";
interface Artwork {
  name: string;
  file: File | null|undefined;
  fileName: string;
  previewUrl:string|null;
}

interface ArtworkUploadFormProps {
  onClose: () => void;
  onSuccessUpload: () => void; 
}

export const ArtworkUploadForm: React.FC<ArtworkUploadFormProps> = ({ onClose, onSuccessUpload }) => {
  const defaultArtworks: Artwork[] = [
    { name: 'Upload Unique Rare', file: null, fileName: '',previewUrl: ''  },
    { name: 'Upload Derivative Edition', file: null, fileName: '',previewUrl: ''  },
  ];
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [artTitle, setArtTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { saveData } = useSaveData();
  const [isFormValid, setIsFormValid] = useState(false);
  const {image,fetchImage} = useFetchImage();
  const [imageCreating, setImageCreating] = useState(false);
  const { imageUrl,file, fetchGeneratedImage } = useFetchGeneratedImage();  
  const [prompt, setPrompt] = useState(false);
  const[choose,setFileChoosen] = useState(false);
  const[imageChoose,setImageChoosen] = useState(false);
  const [message, setMessage] = useState<string>('');


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

  const fetchImageAsBase64 = async (imagePath: string): Promise<string> => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
  
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the prefix if it exists
        const base64WithoutPrefix = base64String.split(',')[1];
        resolve(base64WithoutPrefix);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  
  const handlePrompt = () => {
    setPrompt(true);
  }

  const handleClosePrompt = (event: React.MouseEvent) => {
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
      setArtworks(newArtworks); 
      setPrompt(false);
      setImageCreating(false);
    }
    console.log(res);
  }

  const handleChoosenImage = async (event: React.MouseEvent) => {
    event.preventDefault();
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





 const convertFileToBase64 = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the prefix if it exists
      const base64WithoutPrefix = base64String.split(',')[1];
      resolve(base64WithoutPrefix);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const  generateParticipation = async()=>{
  const fetchedImageData = await convertFileToBase64(artworks[0].file);
  console.log(Badge.src)
   const fetchedLogoData = await fetchImageAsBase64(Badge.src);
  const file = await fetchImage(fetchedImageData, fetchedLogoData);
  
  if (file) {
    artworks[1] = { ...artworks[1], file, fileName: file.name };
  } else {
    artworks[1] = { ...artworks[1], file: null, fileName: '' };
  }
  console.log(artworks[1]);
}
  
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
    await generateParticipation();
   
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
          case 'Upload Derivative Edition':
            artBattle.grayScale = url;
            artBattle.grayScaleReference = referenceUrl;
              break;
          default:
            break;
        }
      }
      await saveData(artBattle as ArtData);
      alert('All files uploaded successfully');
      onSuccessUpload();
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please check the files and try again.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="navbar fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ width: '100vw' }}>
      <div className="bg-white p-4 rounded-lg" style={{ backgroundColor: '#101011f0', border: '2px dotted #3deb34', height: 'auto' , position: 'relative', maxHeight: '95vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
        <h2 className="text-lg font-bold mb-2 text-center" style={{ color: '#3deb34', paddingBottom: 6, borderBottom: '1.5px solid white', fontSize: 18 }}>Upload Artwork</h2>
        <h2 className='text-lg font-medium mb-2 text-red-200 text-center'>Please upload 2 files</h2>
        <hr></hr>
        <form onSubmit={uploadArtWork}>
          {artworks.map((artwork, index) => (
            <div key={index} className='mb-1'>
              {index === 0 && (
                <>
                  <label className="block text-sm font-medium text-gray-900 break-words py-2" style={{ fontWeight: 500, fontSize: 13, color: '#fff', maxWidth: '300px' }}>
                    Upload the highest quality version of your art as the 'Unique Rare'. This version will be minted as a single edition (1:1) and awarded to one lucky winner who picks your art in a battle! This is the version which will be displayed on our site for user to upvote and pick in battle.
                  </label>
                  <label
                    htmlFor={`fileInput-${index}`}
                    className="cursor-pointer bg-white text-sm text-gray-900 rounded-lg focus:outline-none pb-2 mt-2"
                    style={{
                      padding: 5,
                      border: 'none',
                      color: '#000',
                      fontSize: 13
                    }}
                  >
                    {artwork.name}
                  </label>
                  <input type="file" id={`fileInput-${index}`} className="hidden" onChange={handleFileChange(index)} />
                  <span className="px-3 text-sm text-gray-600">{artwork.fileName} </span> 
                 <span onClick={handlePrompt} className='text-sm text-white cursor-pointer'>Generate using Ai</span>
                 {prompt &&(
                 <>
                 <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Your message
                 </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={handleMessageChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                  
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
          <hr className='mt-4'></hr>

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