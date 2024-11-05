// CardHolder.tsx
import React, { useEffect, useState } from 'react';
import { ArtData, useFetchArtById } from '@/hooks/artHooks';
import { useMbWallet } from '@mintbase-js/react';
import { useArtsRaffleCount } from '@/hooks/useRaffleTickets';
import { useRouter } from 'next/navigation';
import './Card.css';
import InlineSVG from 'react-inlinesvg';
import Card from './Card';

interface CardHolderProps {
    artData: ArtData[];
    campaignId: string;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedArt: (e: any) => void;
    currentPage: number;
    totalPage: number;
}

const CardHolder: React.FC<CardHolderProps> = ({ artData, campaignId, setRefresh, setSelectedArt, currentPage, totalPage }) => {
    const { isConnected, selector, connect, activeAccountId, disconnect } = useMbWallet();
    const { fetchArtUserRaffleCount, submitVote } = useArtsRaffleCount();
    const [success, setSuccess] = useState(false);
    const [artTickets, setArtTickets] = useState<number>(0);
    const [myTickets, setMyTickets] = useState<number>(0);
    const router = useRouter();
    const { fetchArtById } = useFetchArtById();
    const [selectedArtId, setSelectedArtId] = useState(null);
    const [overlayArt, setoverlayArt] = useState<ArtData>();
    const [tokenCount, setTokenCount] = useState<number | null>(1);

    const getQueryParam = (param: string): string | null => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            return url.searchParams.get(param);
        }
        return null;
    };
    const artId = getQueryParam('artId');

    useEffect(() => {
        const fetchArt = async () => {
            if (artId) {
                const overlay = await fetchArtById(artId);
                setoverlayArt(overlay);
            }
        }
        fetchArt();
    }, [artId, success]);

    const handleImageClick = async (id: any) => {
        setSelectedArtId(id);
        setSuccess(false);
        const overlay = await fetchArtById(id);
        setoverlayArt(overlay);
        setSelectedArt(overlayArt); // For pass the selected art to upcoming grid component
        const url = new URL(window.location.href);
        url.searchParams.set('artId', id);
        window.history.pushState({}, '', url.toString());

        // if (currentPage !== totalPage) {
        //     const upcomingSection = document.getElementById('upcoming-grid');
        //     if (upcomingSection) {
        //         const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
        //         const isMobile = window.innerWidth < 768 ? true : false;
        //         const rem = isMobile ? 1 : 5;
        //         const offset = rem * 16;
        //         window.scrollTo({
        //             top: !isMobile ? sectionPosition + offset : sectionPosition - 150,
        //             behavior: 'smooth',
        //         });
        //     }
        // } else {
        //     if (artData.length > 4) {
        //         const upcomingSection = document.getElementById('upcoming-grid');
        //         if (upcomingSection) {
        //             const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
        //             const isMobile = window.innerWidth < 768 ? true : false;
        //             const rem = isMobile ? 1 : 5;
        //             const offset = rem * 16;
        //             window.scrollTo({
        //                 top: !isMobile ? sectionPosition + offset : sectionPosition - 150,
        //                 behavior: 'smooth',
        //             });
        //         }
        //     } else {
        //         const upcomingSection = document.getElementById('upcoming');
        //         if (upcomingSection) {
        //             const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
        //             const isMobile = window.innerWidth < 768 ? true : false;
        //             const rem = isMobile ? 1 : 1;
        //             const offset = rem * 16;
        //             window.scrollTo({
        //                 top: !isMobile ? sectionPosition + offset : sectionPosition - 150,
        //                 behavior: 'smooth',
        //             });
        //         }
        //     }
        // }

    };

    const handleClose = () => {
        setSelectedArtId(null);
        setSelectedArt(null);
        setTokenCount(1)
        const url = new URL(window.location.href);
        url.searchParams.delete('artId');
        window.history.pushState({}, '', url.toString());
        setSuccess(false);
    };


    useEffect(() => {
        const fetchArtUserticketss = async () => {
            if (overlayArt) {
                const tickets = await fetchArtUserRaffleCount(overlayArt?._id as string, campaignId);
                setMyTickets(tickets);
            }
        };

        fetchArtUserticketss();
    }, [activeAccountId, fetchArtUserRaffleCount, overlayArt, success]);

    const handleArt = (id: any) => {
        router.push(`/art/${id}`);
    }
    // console.log(activeAccountId)

    const onVote = async (id: string) => {
        if (!isConnected || !activeAccountId) {
            await connect();
            return;
        }
        if (!id) {
            alert("art  not loaded!");
            return;
        }
        if (tokenCount == null || tokenCount === 0) {
            return;
        }
        const success = await submitVote({
            ticketCount: tokenCount,
            artId: id,
            campaignId: campaignId
        });

        console.log(success);
        if (success) {
            setSuccess(true);
            const art = await fetchArtById(id);
            console.log(art);
            setArtTickets(art?.raffleTickets);
            setTokenCount(null)
            //   alert('Vote submitted successfully!');
            setRefresh((prev) => !prev);
        } else {
            setSuccess(false);
            alert("Failed to submit vote. Maybe you already voted!");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const raffleTicketAmount = () => {
        if (tokenCount && tokenCount > 0) {
            return tokenCount * 10;
        } else {
            return 0
        }
    }


    return (
        <>
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-[1.5rem] lg:gap-[1.5rem] md:gap-[1rem] gap-[0.5rem]" id="upcoming-grid">
                {artData.map((art, index) => (
                    <div key={index}>
                        <Card art={art} onImageClick={handleImageClick} campaignId={campaignId} success={success} />
                    </div>
                ))}
            </div>
            {selectedArtId && overlayArt && <div className="upcoming-popup-holder fixed top-0 z-50 w-full h-full flex items-center justify-center px-3">
                <div className="upcoming-popup lg:w-[43.5rem] md:w-[40.5rem] w-full h-auto lg:p-10 md:p-8  p-4 rounded-2xl bg-black">
                    <div className="close-art w-full flex justify-end">
                        <div className="close-icon md:w-[1.9rem] md:h-[1.9rem] w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-md cursor-pointer" onClick={handleClose}>
                            <InlineSVG
                                src="/icons/close.svg"
                                className="md:w-4 md:h-4 w-3 h-3 spartan-light"
                            />
                        </div>
                    </div>
                    <div className="artist-name flex items-center md:justify-start justify-center gap-3 py-1">
                        <div className="artist flex items-center gap-2">
                            <InlineSVG
                                src='/icons/profile.svg'
                                color='#00FF00'
                                className='fill-current w-4 h-4'
                            />
                            <h4 className='text-green spartan-medium md:text-md text-sm'>Artist name</h4>
                        </div>
                        <div className="name">
                            <h2 className='md:spartan-bold spartan-semibold text-sm md:text-lg'>{overlayArt.artistId}</h2>
                        </div>
                    </div>
                    <div className="art-center w-full h-auto flex md:flex-row flex-col items-center justify-between lg:py-4 md:py-2 py-1">
                        <div className="art-img md:w-[50%] w-full flex md:justify-start justify-center gap-7">
                            <div className="img-outer p-[0.5rem] rounded-xl">
                                <div className="relative img-holder lg:w-[15rem] lg:h-[15rem] md:w-[14rem] md:h-[14rem] w-[14rem] h-[14rem] rounded-xl">
                                    <img src={overlayArt.colouredArt} alt={overlayArt.arttitle} className='w-full h-full rounded-xl' />

                                    <div className={`absolute bottom-0 w-full flex items-center ${activeAccountId === "rapid-aurora.testnet" ? "justify-between" : "justify-end"} px-3 pb-2`}>
                                        {activeAccountId === "rapid-aurora.testnet" && <div className="hide w-[2.5rem] h-[2.5rem] bg-white flex justify-center items-center rounded-full">
                                            <InlineSVG
                                                src="/icons/hide.svg"
                                                className="w-8 h-8 spartan-medium"
                                            />
                                        </div>}
                                        <div className="like w-[2.5rem] h-[2.5rem] bg-white flex justify-center items-center rounded-full">
                                            <InlineSVG
                                                src={`/icons/${myTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                                                className="w-7 h-7 spartan-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="art-info w-full flex justify-between items-center py-2 px-4 md:flex hidden">
                                    <div className="art-owner md:w-[10rem] w-[5rem]">
                                        <h2 className='collect lg:text-md md:text-sm text-xs spartan-semibold md:w-[9rem] w-[2.5rem] truncate overflow-hidden whitespace-nowraps'>Total Collects</h2>
                                    </div>
                                    <div className="upvotes">
                                        <h2 className='text-green'>{overlayArt.raffleTickets as number}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="art-info md:w-[50%] w-full">
                            <div className="upvotes w-auto flex items-center md:justify-start justify-center gap-2 py-1 pt-3">
                                <div className="count flex justify-center items-center p-2 rounded-md min-w-[1.5rem] min-h-[1.5rem]" style={{ aspectRatio: '1' }}>
                                    <h2 className='spartan-medium text-md text-center overflow-hidden'>{overlayArt.raffleTickets as number}</h2>
                                </div>
                                <h2 className='spartan-semibold md:text-lg text-xl'>Raffle Tickets</h2>
                            </div>
                            <div className="upload-date flex items-center md:justify-start justify-center md:gap-3 gap-6 md:py-2 py-1">
                                <div className="date flex items-center gap-2">
                                    <InlineSVG
                                        src='/icons/calender.svg'
                                        color='#00FF00'
                                        className='fill-current w-5 h-5'
                                    />
                                    <h4 className='text-green spartan-medium md:text-sm text-md'>Upload Date</h4>
                                </div>
                                <div className="name">
                                    <h2 className='spartan-semibold text-md'>{formatDate(overlayArt.uploadedTime instanceof Date ? overlayArt.uploadedTime.toISOString() : overlayArt.uploadedTime)}</h2>
                                </div>
                            </div>
                            <h2 className='spartan-medium md:text-lg text-md py-2 text-green md:text-left text-center'>Description</h2>
                            {/* <h6 className='saprtan-medium description-text md:text-md text-sm py-1 md:text-left text-center leading-tight'>{overlayArt.arttitle}</h6> */}
                            <h6 className='saprtan-medium description-text md:text-md text-sm py-1 md:text-left text-center leading-tight'>A white skin tone and glassy skin which contains the Girl with purple hair in a ice background, looking at a top angle of the camera view.</h6>
                            <div className="tickets flex items-center md:justify-start justify-center gap-2 py-2">
                                <h5 className='text-white text-md'>My Tickets</h5>
                                <span className='text-green text-lg'>{myTickets as number > 0 ? myTickets : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="art-bottom w-full h-auto">
                        <div className="upvote-btn w-full flex flex-col items-center gap-10 md:pb-0 pb-5">
                            <div className="enter-tickets w-full flex md:flex-row flex-col items-center justify-center gap-4">
                                <h3 className='text-white spartan-semibold enter-text'>Enter number of tickets to buy</h3>
                                <div className="enter-input md:w-[10rem] w-full md:h-[2.3rem] h-[2.7rem] rounded-[8px]">
                                    <input type="number" className='w-full h-full rounded-[8px]' value={tokenCount ? tokenCount : ""} placeholder='0' onChange={(e) => setTokenCount(Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="buy-tickets flex flex-col items-center gap-3">
                                <h3 className='coin-count spartan-semibold md:text-lg text-md'>{raffleTicketAmount()} GFXvs Coins</h3>
                                <div className="collect-btn flex items-center gap-2 justify-center py-[0.5rem] px-[3rem] rounded-[0.8rem]" onClick={() => onVote(overlayArt._id)}>
                                    <InlineSVG
                                        src='/icons/gfx-point.svg'
                                        className='fill-current w-8 h-8'
                                    />
                                    <h3 className='spartan-semibold text-white collect-text'>Collect</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>

    );
};

export default CardHolder;
