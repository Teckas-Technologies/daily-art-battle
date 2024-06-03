import React, { useEffect, useState } from 'react';
import { useMbWallet } from "@mintbase-js/react";
interface ArtPieceProps {
    art: {
        id: string;
        name: string;
        imageUrl: string;
    };
    onVote: () => void;
    battleEndTime?: Date;
    success:boolean;
    votedFor?:string
}

const ArtPiece: React.FC<ArtPieceProps> = ({ art, onVote, success,votedFor }) => {
    const { isConnected, connect, activeAccountId } = useMbWallet();
    console.log(votedFor);

    return (
        <>
        <div className="flex flex-col items-center mt-5" style={{ width: '100%' }}>
       
            <img src={art.imageUrl} alt={art.name} style={{ width: 400, height: 400 }} className="h-64 w-64 object-cover rounded-lg" />
            {votedFor == art.name ?(
                <button onClick={onVote}  disabled={!isConnected||success} className={`px-4 text-xs mt-2 py-2 font-semibold bg-green-600 text-white rounded ${!isConnected||success ? 'cursor-not-allowed' : ''}`}>Voted for {art.name}</button>
            ) : (
            <button onClick={onVote}  disabled={!isConnected||success} className={`px-4 text-xs mt-2 py-2 vote-btn text-white rounded ${!isConnected||success ? 'cursor-not-allowed' : ''}`}>Pick Variation {art.name}</button>
            )}
            </div>
        
        </>
    );
};

export default ArtPiece;
