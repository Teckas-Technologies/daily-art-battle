// Card.tsx
import React from 'react';
import './Card.css';
import InlineSVG from 'react-inlinesvg';
import { ArtData } from '@/hooks/artHooks';
import { Vote } from '@/hooks/useArtVoting';
import { useMbWallet } from '@mintbase-js/react';

interface CardProps {
    art: ArtData;
    onVote: (id: string) => Promise<void>;
    votes: Vote[];
    onImageClick: (id: string) => Promise<void>;
}

const Card: React.FC<CardProps> = ({ art, onVote, votes, onImageClick }) => {

    const { activeAccountId } = useMbWallet();
    const hasUpvoted = votes?.some(
        (vote) => vote.artId === art._id && vote.participantId === activeAccountId
    );

    return (
        <div className="card md:w-[18.5rem] md:h-[26.5rem] w-[10rem] h-[15.5rem] gap-0 rounded-[1.25rem] md:mt-5 mt-0 shadow-md p-[0.5rem] flex flex-col items-center">
            <div className="art-img md:w-[17.5rem] md:h-[17.5rem] w-[9rem] h-[9rem] rounded-[1.25rem] cursor-pointer" onClick={() => onImageClick(art._id)}>
                <img src={art?.colouredArt} alt={art?.arttitle} className="w-full h-full object-cover rounded-[1.25rem]" />
            </div>
            <div className="art-info w-full h-auto flex justify-between items-center md:py-5 py-3 px-1">
                <div className="art-owner md:w-[10rem] w-[5rem] flex items-center md:gap-2 gap-1">
                    <InlineSVG
                        src='/icons/profile.svg'
                        className='md:w-4 md:h-4 w-3 h-3'
                    />
                    <h2 className='text-xs spartan-medium md:w-[9rem] w-[2.5rem] truncate overflow-hidden whitespace-nowraps'>{art?.artistId}</h2>
                </div>
                <div className="upvotes w-auto flex items-center md:gap-2 gap-1">
                    <div className="count flex justify-center items-center p-1 rounded-md md:min-w-[1.5rem] md:min-h-[1.5rem] min-w-[1.2rem] min-h-[1.2rem]" style={{ aspectRatio: '1' }}>
                        <h2 className='spartan-medium md:text-sm text-xs text-center overflow-hidden'>{art?.upVotes as number}</h2>
                    </div>
                    <h2 className='spartan-light md:text-sm text-xs'>Upvotes</h2>
                </div>
            </div>
            <div className="upvote-btn w-full flex justify-center px-1">
                <div className="outside w-full rounded-lg p-[0.1rem]">
                    <button className={`w-full md:py-3 py-1 rounded-lg ${hasUpvoted ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => onVote(art?._id)} disabled={hasUpvoted}>
                        <h2 className='spartan-bold text-md'>{hasUpvoted ? 'Upvoted' : 'Upvote Art'}</h2>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
