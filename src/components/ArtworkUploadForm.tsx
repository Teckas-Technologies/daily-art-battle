"use client"
import React, { useState,ChangeEvent} from 'react';
import { uploadFile, uploadReference } from '@mintbase-js/storage';
import { useMbWallet } from "@mintbase-js/react";
import {useSaveData, ArtData} from "../hooks/artHooks";
interface Artwork {
  name: string;
  file: File | null;
  fileName: string;
}
interface ArtworkUploadFormProps {
  onClose: () => void;
}
export const ArtworkUploadForm: React.FC<ArtworkUploadFormProps> = ({ onClose }) => {
  const defaultArtworks: Artwork[] = [
    { name: 'Unique Rare', file: null , fileName: ''},
    { name: 'Participation Reward', file: null , fileName: ''},
  ];
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [artTitle, setArtTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { saveData, loading, error, success } = useSaveData();
  const [showAlert, setShowAlert] = useState(true);
  const handleFileChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const newArtworks = [...artworks];
    if (file) {
      newArtworks[index] = { ...newArtworks[index], file, fileName: file.name };
    } else {
      newArtworks[index] = { ...newArtworks[index], file: null, fileName: '' };
    }
    setArtworks(newArtworks);
  };

  const handleArtName = (e: any) => {
    const name = e.target.value;
    setArtTitle(name);
    console.log(artTitle)
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isConnected || !activeAccountId) {
      connect();
      return;
    }
    setUploading(true);
    try {
      const artBattle: Partial<ArtData> = { artistId: activeAccountId };
      if(artworks.length < 2) {
        alert("Please Upload All files");
      }
      artBattle.arttitle = artTitle;
      
      for (const artwork of artworks) {
        if (!artwork.file) {
          alert(`Missing file for ${artwork.name}`);
          break;
        }
        const uploadResult = await uploadFile(artwork.file);
        const url = `https://arweave.net/${uploadResult.id}`;
        console.log("Media Url: ", url);
        const metadata = {
          title: "Art Battle",
          media: artwork.file
        }
        const referenceResult = await uploadReference(metadata);
        const referenceUrl = `https://arweave.net/${referenceResult.id}`;
        switch (artwork.name) {
          case 'Unique Rare':
            artBattle.colouredArt = url;
            artBattle.colouredArtReference = referenceUrl;
            break;
          case 'Participation Reward':
            artBattle.grayScale = url;
            artBattle.grayScaleReference = referenceUrl;
        }

      }
      console.log(artBattle);
      await saveData(artBattle as ArtData);
      alert('All files uploaded successfully');
      onClose();
      location.reload();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ width: '100vw' }}>
      <div className="bg-white p-4 rounded-lg" style={{ backgroundColor: '#101011f0', border: '2px dotted #8730aa', height: 'auto', maxHeight: '95vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
      <h2 className="text-lg font-bold mb-2 text-center" style={{color:'#8730aa', paddingBottom:6, borderBottom: '1.5px solid white', fontSize: 18}}>Upload Artwork</h2>
              {showAlert && (
          <div className="bg-yellow-200 text-yellow-800 p-3 rounded-md mb-4 max-w-xs">
            {/* <button className="float-right text-yellow-800" onClick={() => setShowAlert(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button> */}
            <p className="font-semibold" style={{ fontSize: '0.875rem' }}>Please upload four distinct files, two for each artwork variation:</p>
            <ol className="list-decimal ml-6">
              <li style={{ fontSize: '0.875rem' }} > Color: This version will be minted as a single edition (1:1) and awarded to one lucky winner from those who voted for this variation.</li>
              <li style={{ fontSize: '0.875rem' }} >Grayscale: This version will be minted for everyone who voted for this variation as a participation reward.</li>
            </ol>
          </div>
        )}
      
        <form onSubmit={handleSubmit}>
            <div className='mb-1'>
                <label className="block text-sm font-medium text-gray-900" style={{fontWeight:500, fontSize: 13, color:'#fff'}}>
               Art Title
              </label>
              <input type="text" onChange={handleArtName} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none" style={{padding:5, border:'none', color:'#000', fontSize:13}}/>
            </div>
          {artworks.map((artwork, index) => (
            <div key={index} className='mb-1'>
              {index===0 &&(
                  <label className="block text-sm font-medium text-gray-900" style={{fontWeight:500, fontSize: 13, color:'#fff'}}>
                  Variation
                 </label>
              )
              }
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
              <span className="px-3 text-sm text-gray-600">{artwork.fileName}</span>
                <br></br>
              </div>
          ))}
          <div className="mt-2 space-x-3 flex justify-end">
            <button type="button" onClick={onClose} className=" cancel-btn text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" disabled={uploading || loading} className="mr-2 upload-btn text-white px-4 py-2 rounded">
              {uploading || loading ? 'Processing...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>  
  );
};