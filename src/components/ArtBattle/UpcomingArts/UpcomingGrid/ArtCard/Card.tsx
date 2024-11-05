// Card.tsx
import React, { useEffect, useState } from 'react';
import './Card.css';
import InlineSVG from 'react-inlinesvg';
import { ArtData } from '@/hooks/artHooks';
import { useArtsRaffleCount, Vote } from '@/hooks/useRaffleTickets';
import { useMbWallet } from '@mintbase-js/react';

interface CardProps {
    art: ArtData;
    onImageClick: (id: string) => Promise<void>;
    campaignId: string;
    success: boolean;
}

const Card: React.FC<CardProps> = ({ art, onImageClick, campaignId, success }) => {

    const { activeAccountId } = useMbWallet();
    const { fetchArtUserRaffleCount } = useArtsRaffleCount();
    const [myTickets, setMyTickets] = useState<number>(0);

    useEffect(() => {

        const fetchArtUserticketss = async () => {
            if (art) {
                const tickets = await fetchArtUserRaffleCount(art?._id as string, campaignId);
                setMyTickets(tickets);
                console.log("My tickets : ", myTickets);
            }
        };

        fetchArtUserticketss();
    }, [activeAccountId, fetchArtUserRaffleCount, campaignId, success]);

    return (
        <div className="card w-auto gap-0 md:rounded-[1.25rem] rounded-[1rem] md:mt-5 mt-0 shadow-md p-[0.5rem] flex flex-col items-center"> {/* lg:w-[18.5rem] lg:h-[26.5rem] md:w-[17rem] md:h-[25rem] w-[10rem] h-[15.5rem] */}
            <div className="relative art-img xxl:w-[17.5rem] xxl:h-[17.5rem] xl:w-[14rem] xl:h-[14rem] lg:w-[15rem] lg:h-[15rem] md:w-[15rem] md:h-[15rem] w-[6.8rem] h-[6.8rem] md:rounded-[1.25rem] rounded-[0.8rem] cursor-pointer" onClick={() => onImageClick(art._id)} >
                <img src={art?.colouredArt} alt={art?.arttitle} className="w-full h-full object-cover md:rounded-[1.25rem] rounded-[0.8rem]" />
                <div className="absolute bottom-0 w-full flex items-center justify-between md:px-3 md:pb-2 px-2 pb-1">
                    <div className={`relative w-full flex items-center ${activeAccountId === "rapid-aurora.testnet" ? "justify-between" : "justify-end"}`}>
                        {activeAccountId === "rapid-aurora.testnet" && <div className="hide md:w-[3rem] md:h-[3rem] w-[1.7rem] h-[1.7rem] bg-white flex justify-center items-center rounded-full cursor-pointer hover:move-like">
                            <InlineSVG
                                src="/icons/hide.svg"
                                className="md:w-8 md:h-8 w-5 h-5 spartan-medium"
                            />
                        </div>}
                        <div className="like transform transition-all duration-300 md:w-[3rem] md:h-[3rem] w-[1.7rem] h-[1.7rem] bg-white flex justify-center items-center rounded-full z-10 ml-2">
                            <InlineSVG
                                src={`/icons/${myTickets as number > 0 ? "uparrow.svg" : "heart.svg"}`}
                                className="md:w-7 md:h-7 w-4 h-4 spartan-medium"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="art-info w-full flex justify-between items-center md:py-2 md:px-4 py-1 px-1">
                <div className="art-owner">
                    <h2 className='collect lg:text-md md:text-sm text-xs md:spartan-semibold spartan-light md:w-[9rem] w-[4.5rem] truncate overflow-hidden whitespace-nowraps'>Total Collects</h2>
                </div>
                <div className="upvotes">
                    <h2 className='text-green md:text-md text-sm'>{art.raffleTickets as number}</h2>
                </div>
            </div>
        </div>
    );
};

export default Card;
