import React, { useEffect, useState } from 'react';
import { useMbWallet } from "@mintbase-js/react";
import { Button } from './ui/button';
interface ArtPieceProps {
    art: {
        id: string;
        name: string;
        imageUrl: string;
        title:string;
        artistId:string;
    };
    onVote: () => void;
    battleEndTime?: Date;
    success:boolean;
    votedFor?:string
}

const ArtPiece: React.FC<ArtPieceProps> = ({ art, onVote, success,votedFor }) => {
    const { isConnected, connect, activeAccountId } = useMbWallet();

    return (
        <>
        <div className="flex flex-col items-center mt-5 px-4" style={{ width: '100%' }}>
      
        <img
    src={art.imageUrl}
    alt={art.name}
    width={100}
    height={100}
 className=" w-36 h-36 md:shrink-0 max-w-full max-h-full lg:w-80 lg:h-80 shadow-lg"
 style={{
    background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    backdropFilter: 'blur(10px)', // Blur effect
    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 30px 0 rgba(0, 0, 0, 0.25)', // Shadow effect
    borderRadius: '10px', // Rounded corners
    border: '1px solid rgba(255, 255, 255, 0.3)', // Light border to enhance glass effect
    padding: '20px', // Padding for inner content
    color: '#fff', // White text color for contrast
  }}
  />

<p className="mt-2 text-black py-2 text-xs sm:text-sm font-small break-all text-center whitespace-pre-wrap">
      {art.title} by {art.artistId}
    </p>
    <div className="flex items-center mt-auto p-4">
            {votedFor == art.name ?(
                <Button onClick={onVote}  disabled={!isConnected||success} className={`px-4 text-xs mt-2 py-2 font-semibold bg-green-600 text-white rounded ${!isConnected||success ? 'cursor-not-allowed' : ''}`}>Voted {art.name}</Button>
            ) : (
            <Button onClick={onVote}  disabled={!isConnected||success} className={`px-4 text-xs mt-2 py-2 vote-btn text-white rounded ${!isConnected||success ? 'cursor-not-allowed' : ''}`}>Pick {art.name}</Button>
            )} 
            </div>
            </div> 
        </>
    );
};

export default ArtPiece;
