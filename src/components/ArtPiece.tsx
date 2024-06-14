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
    className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-59 lg:h-59 md:shrink-0 custom-img-size"
    style={{width:"60%",height:"80%"}}
  />
  <p className="mt-2 text-black py-2 text-xs sm:text-sm font-small break-words text-center">{art.title} by {art.artistId}</p>
            {votedFor == art.name ?(
                <Button onClick={onVote}  disabled={!isConnected||success} className={`px-4 text-xs mt-2 py-2 font-semibold bg-green-600 text-white rounded ${!isConnected||success ? 'cursor-not-allowed' : ''}`}>Voted for {art.name}</Button>
            ) : (
            <Button onClick={onVote}  disabled={!isConnected||success} className={`px-4 text-xs mt-2 py-2 vote-btn text-white rounded ${!isConnected||success ? 'cursor-not-allowed' : ''}`}>Pick Variation {art.name}</Button>
            )}
            </div>
        
        </>
    );
};

export default ArtPiece;
