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
        <div className="card w-full gap-0 rounded-[1.25rem] md:mt-5 mt-0 shadow-md p-[0.5rem] flex flex-col items-center"> {/* lg:w-[18.5rem] lg:h-[26.5rem] md:w-[17rem] md:h-[25rem] w-[10rem] h-[15.5rem] */}
            <div className="relative art-img lg:w-[17.5rem] lg:h-[17.5rem] md:w-[16rem] md:h-[16rem] w-[9rem] h-[9rem] rounded-[1.25rem] cursor-pointer" onClick={() => onImageClick(art._id)}>
                <img src={art?.colouredArt} alt={art?.arttitle} className="w-full h-full object-cover rounded-[1.25rem]" />
                <div className="absolute bottom-0 w-full flex items-center justify-between px-3 pb-2">
                    <div className="hide w-[3rem] h-[3rem] bg-white flex justify-center items-center rounded-full">
                        <InlineSVG
                            src="/icons/hide.svg"
                            className="w-8 h-8 spartan-medium"
                        />
                    </div>
                    <div className="like w-[3rem] h-[3rem] bg-white flex justify-center items-center rounded-full">
                        <InlineSVG
                            src={`/icons/${hasUpvoted ? "uparrow.svg": "heart.svg"}`}
                            className="w-7 h-7 spartan-medium"
                        />
                    </div>
                </div>
            </div>
            <div className="art-info w-full flex justify-between items-center py-2 px-4">
                <div className="art-owner md:w-[10rem] w-[5rem]">
                    <h2 className='collect lg:text-md md:text-sm text-xs spartan-semibold md:w-[9rem] w-[2.5rem] truncate overflow-hidden whitespace-nowraps'>Total Collects</h2>
                </div>
                <div className="upvotes">
                    <h2 className='text-green'>{art.upVotes as number}</h2>
                </div>
            </div>
        </div>
    );
};

export default Card;
