// CardHolder.tsx
import React, { useEffect, useState } from 'react';
import { ArtData, useFetchArtById } from '@/hooks/artHooks';
import { useMbWallet } from '@mintbase-js/react';
import { useVoting, Vote } from '@/hooks/useArtVoting';
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
    const { isConnected, selector, connect, activeAccountId } = useMbWallet();
    const { votes, fetchVotes, submitVote } = useVoting();
    const [success, setSuccess] = useState(false);
    const [upvotes, setVotes] = useState<Vote[]>([]);
    const router = useRouter();
    const { fetchArtById } = useFetchArtById();
    const [selectedArtId, setSelectedArtId] = useState(null);
    const [overlayArt, setoverlayArt] = useState<ArtData>();

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
    }, [artId]);

    const handleImageClick = async (id: any) => {
        setSelectedArtId(id);
        const overlay = await fetchArtById(id);
        setoverlayArt(overlay);
        setSelectedArt(overlayArt); // For pass the selected art to upcoming grid component
        const url = new URL(window.location.href);
        url.searchParams.set('artId', id);
        window.history.pushState({}, '', url.toString());

        if (currentPage !== totalPage) {
            const upcomingSection = document.getElementById('upcoming-grid');
            if (upcomingSection) {
                const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
                const isMobile = window.innerWidth < 768 ? true : false;
                const rem = isMobile ? 1 : 5;
                const offset = rem * 16;
                window.scrollTo({
                    top: !isMobile ? sectionPosition + offset : sectionPosition - 150,
                    behavior: 'smooth',
                });
            }
        } else {
            if (artData.length > 4) {
                const upcomingSection = document.getElementById('upcoming-grid');
                if (upcomingSection) {
                    const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
                    const isMobile = window.innerWidth < 768 ? true : false;
                    const rem = isMobile ? 1 : 5;
                    const offset = rem * 16;
                    window.scrollTo({
                        top: !isMobile ? sectionPosition + offset : sectionPosition - 150,
                        behavior: 'smooth',
                    });
                }
            } else {
                const upcomingSection = document.getElementById('upcoming');
                if (upcomingSection) {
                    const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
                    const isMobile = window.innerWidth < 768 ? true : false;
                    const rem = isMobile ? 1 : 1;
                    const offset = rem * 16;
                    window.scrollTo({
                        top: !isMobile ? sectionPosition + offset : sectionPosition - 150,
                        behavior: 'smooth',
                    });
                }
            }
        }

    };

    const handleClose = () => {
        setSelectedArtId(null);
        setSelectedArt(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('artId');
        window.history.pushState({}, '', url.toString());
    };


    useEffect(() => {
        const fetchUserVotes = async () => {
            if (activeAccountId) {
                const votes = await fetchVotes(activeAccountId, campaignId);
                setVotes(votes);
            }
        };

        fetchUserVotes();
    }, [activeAccountId, fetchVotes]);

    const handleArt = (id: any) => {
        router.push(`/art/${id}`);
    }

    const onVote = async (id: string) => {
        if (!isConnected || !activeAccountId) {
            await connect();
            return;
        }
        if (!id) {
            alert("art  not loaded!");
            return;
        }
        const success = await submitVote({
            participantId: activeAccountId,
            artId: id,
            campaignId: campaignId
        });

        console.log(success);
        if (success) {
            setSuccess(true);
            const votes = await fetchVotes(activeAccountId, campaignId);
            console.log(votes);
            setVotes(votes);
            //   alert('Vote submitted successfully!');
            setRefresh((prev) => !prev);
        } else {
            alert("Failed to submit vote. Maybe you already voted!");
        }
    };

    const hasUpvoted = votes?.some(
        (vote) => vote.artId === selectedArtId && vote.participantId === activeAccountId
    );

    useEffect(() => {
        if (selectedArtId && overlayArt) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedArtId, overlayArt]);


    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-[2rem] gap-[1.5rem]" id="upcoming-grid">
                {artData.map((art, index) => (
                    <div key={index}>
                        <Card art={art} onVote={onVote} votes={upvotes} onImageClick={handleImageClick} />
                    </div>
                ))}
            </div>
            {selectedArtId && overlayArt && <div className="upcoming-popup-holder absolute z-40 w-full h-full flex items-center justify-center px-3">
                <div className="upcoming-popup lg:w-[43.5rem] lg:h-[33.5rem] md:w-[40.5rem] md:h-[30.5rem] w-full h-[30rem] lg:p-10 md:p-8  p-6 rounded-2xl bg-black">
                    <div className="close-art w-full flex justify-end">
                        <div className="close-icon w-[1.9rem] h-[1.9rem] flex items-center justify-center rounded-md cursor-pointer" onClick={handleClose}>
                            <InlineSVG
                                src="/icons/close.svg"
                                className="w-4 h-4 spartan-light"
                            />
                        </div>
                    </div>
                    <div className="artist-name flex items-center gap-3 py-1">
                        <div className="artist flex items-center gap-2">
                            <InlineSVG
                                src='/icons/profile.svg'
                                color='#00FF00'
                                className='fill-current md:w-4 md:h-4 w-3 h-3'
                            />
                            <h4 className='text-green spartan-medium'>Artist name</h4>
                        </div>
                        <div className="name">
                            <h2 className='spartan-bold text-lg'>{overlayArt.artistId}</h2>
                        </div>
                    </div>
                    <div className="art-center w-full h-auto flex items-center justify-between lg:py-4 md:py-2 py-1">
                        <div className="art-img w-[50%] flex  gap-7">
                            <div className="img-holder lg:w-[18rem] lg:h-[18rem] md:w-[16rem] md:h-[16rem] w-[15rem] h-[15rem] rounded-xl">
                                <img src={overlayArt.colouredArt} alt={overlayArt.arttitle} className='w-full h-full rounded-xl' />
                            </div>
                        </div>
                        <div className="art-info w-[50%]">
                            <div className="upvotes w-auto flex items-center md:gap-2 gap-1 py-1">
                                <div className="count flex justify-center items-center md:p-2 p-1 rounded-md md:min-w-[1.5rem] md:min-h-[1.5rem] min-w-[1.2rem] min-h-[1.2rem]" style={{ aspectRatio: '1' }}>
                                    <h2 className='spartan-medium md:text-md text-sm text-center overflow-hidden'>{overlayArt.upVotes as number}</h2>
                                </div>
                                <h2 className='spartan-semibold md:text-lg text-xs'>Upvotes</h2>
                            </div>
                            <h2 className='spartan-medium text-lg py-4 text-green'>Description</h2>
                            <h6 className='saprtan-medium description-text py-1'>{overlayArt.arttitle}</h6>
                            {/* <h6 className='saprtan-medium description-text py-1'>A white skin tone and glassy skin which contains the Girl with purple hair in a ice background, looking at a top angle of the camera view.</h6> */}
                            <div className="upload-date flex items-center gap-3 py-2">
                                <div className="date flex items-center gap-2">
                                    <InlineSVG
                                        src='/icons/calender.svg'
                                        color='#00FF00'
                                        className='fill-current md:w-6 md:h-6 w-3 h-3'
                                    />
                                    <h4 className='text-green spartan-medium text-md'>Upload Date</h4>
                                </div>
                                <div className="name">
                                    <h2 className='spartan-bold spartan-semibold text-lg'>12 Oct 2024</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="art-bottom w-full h-auto pt-2">
                        <div className="upvote-btn lg:w-[18rem] md:w-[16rem] w-[15rem] flex justify-center">
                            <div className="outside w-full rounded-lg p-[0.08rem]">
                                <button className={`w-full md:py-3 py-1 rounded-lg ${hasUpvoted ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => onVote(overlayArt._id)} disabled={hasUpvoted}>
                                    <h2 className='spartan-bold text-md'>{hasUpvoted ? 'Upvoted' : 'Upvote Art'}</h2>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>

    );
};

export default CardHolder;
