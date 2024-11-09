// CardHolder.tsx
import React, { useEffect, useState } from 'react';
import { ArtData, useFetchArtById } from '@/hooks/artHooks';
import { useMbWallet } from '@mintbase-js/react';
import { useArtsRaffleCount } from '@/hooks/useRaffleTickets';
import { useRouter } from 'next/navigation';
import './Card.css';
import InlineSVG from 'react-inlinesvg';
import Card from './Card';
import { useSendWalletData } from '@/hooks/saveUserHook';
import Toast from '@/components/Toast';

interface CardHolderProps {
    artData: ArtData[];
    campaignId: string;
    adminEmail: string;
    userMail: string;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedArt: (e: any) => void;
    totalPage: number;
    removeArtById: (id: string) => void;
}

const CardHolder: React.FC<CardHolderProps> = ({ artData, campaignId, adminEmail, userMail, setRefresh, setSelectedArt, totalPage, removeArtById }) => {
    const { isConnected, selector, connect, activeAccountId, disconnect } = useMbWallet();
    const { fetchArtUserRaffleCount, submitVote } = useArtsRaffleCount();
    const [success, setSuccess] = useState(false);
    const [artTickets, setArtTickets] = useState<number>(0);
    const [myTickets, setMyTickets] = useState<number>(0);
    const router = useRouter();
    const { fetchArtById } = useFetchArtById();
    const { sendWalletData } = useSendWalletData();
    const [selectedArtId, setSelectedArtId] = useState(null);
    const [overlayArt, setoverlayArt] = useState<ArtData>();
    const [tokenCount, setTokenCount] = useState<number | null>(1);
    const [myTicketsNew, setMyTicketsNew] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(false);
    const [raffleInfo, setRaffleInfo] = useState(false);
    // const [user, setUser] = useState<any>(null);

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
        setTokenCount(1);
        const url = new URL(window.location.href);
        url.searchParams.delete('artId');
        window.history.pushState({}, '', url.toString());
        // setSuccess(false);
    };

    // useEffect(()=>{
    //     if(activeAccountId) {
    //         const res = fetchUser();
    //         setUser(res);
    //         console.log("Res:", res);
    //     }
    // }, [activeAccountId])

    // const fetchUser = async () => {
    //     if(!activeAccountId) return;
    //     const res = await sendWalletData(activeAccountId);
    //     console.log("Res:", res);
    //     return res;
    // }

    useEffect(() => {
        const fetchAllTickets = async () => {
            const ticketsMap: { [key: string]: number } = {};
            await Promise.all(
                artData.map(async (art) => {
                    const tickets = await fetchArtUserRaffleCount(art._id as string, campaignId);
                    ticketsMap[art._id] = tickets;
                })
            );
            setMyTicketsNew(ticketsMap);
        };

        if (artData.length > 0) {
            // fetchAllTickets();
            const timer = setTimeout(() => {
                fetchAllTickets();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [artData, campaignId, success]);

    const fetchArtUserticketss = async (art: ArtData) => {
        if (art) {
            const tickets = await fetchArtUserRaffleCount(art?._id as string, campaignId);
            setMyTickets(tickets);
        }
    };

    useEffect(() => {
        if (overlayArt) {
            fetchArtUserticketss(overlayArt);
        }
    }, [activeAccountId, fetchArtUserRaffleCount, overlayArt, success]);

    const handleArt = (id: any) => {
        router.push(`/art/${id}`);
    }
    // console.log(activeAccountId)

    const onVote = async (id: string) => {
        if (!id) {
            alert("art  not loaded!");
            return;
        }
        if (tokenCount == null || tokenCount === 0) {
            return;
        }
        // if (userDetails?.user?.gfxCoin < raffleTicketAmount()) {
        //     alert("Insufficient gfxCoin to submit vote!");
        //     return;
        // }
        setLoading(true);
        const success = await submitVote({
            ticketCount: tokenCount,
            artId: id,
            campaignId: campaignId
        });

        // console.log(success);
        if (success) {
            setSuccess(true);
            handleClose();
            const art = await fetchArtById(id);
            console.log(art);
            setArtTickets(art?.raffleTickets);
            // setTokenCount(null)
            //   alert('Vote submitted successfully!');
            setLoading(false);
            setRefresh((prev) => !prev);
            // setSuccess(false);
        } else {
            setSuccess(false);
            setLoading(false);
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

    const openAndCloseInfo = () => {
        setRaffleInfo(true);
        setTimeout(() => setRaffleInfo(false), 5000);
    }


    return (
        <>
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-[1.5rem] lg:gap-[1.5rem] md:gap-[1rem] gap-[0.5rem]" id="upcoming-grid">
                {artData.map((art, index) => (
                    <div key={index}>
                        <Card art={art} myTicketsNew={myTicketsNew[art._id] || 0} onImageClick={handleImageClick} removeArtById={removeArtById} campaignId={campaignId} success={success} overlayArt={overlayArt} adminEmail={adminEmail} userMail={userMail} />
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

                                    <div className={`absolute bottom-0 w-full flex items-center ${false ? "justify-between" : "justify-end"} px-3 pb-2`}>
                                        {/* adminEmail === userMail */}
                                        {false && <div className="hide w-[2.5rem] h-[2.5rem] bg-white flex justify-center items-center rounded-full">
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
                                <div className="art-info w-full flex justify-between items-center py-2 px-4">
                                    <div className="art-owner md:w-[10rem] w-[10rem]">
                                        <h2 className='collect lg:text-md md:text-sm text-xs spartan-semibold md:w-[9rem] w-[5rem] truncate overflow-hidden whitespace-nowraps'>Collects</h2>
                                    </div>
                                    <div className="upvotes">
                                        <h2 className='text-green'>{overlayArt?.raffleTickets as number}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="art-info md:w-[50%] w-full">
                            <div className="upvotes relative w-auto flex items-center md:justify-start justify-center gap-2 py-1 pt-3">
                                {/* <div className="count flex justify-center items-center p-2 rounded-md min-w-[1.5rem] min-h-[1.5rem]" style={{ aspectRatio: '1' }}>
                                    <h2 className='spartan-medium text-md text-center overflow-hidden'>{overlayArt?.raffleTickets as number}</h2>
                                </div> */}
                                <h2 className='spartan-semibold md:text-lg text-xl raffle-text'>Raffle Tickets</h2>
                                <InlineSVG
                                    src='/icons/info.svg'
                                    color='#00FF00'
                                    className='fill-current point-c w-4 h-4 cursor-pointer'
                                    onClick={openAndCloseInfo}
                                />
                                {raffleInfo && <div className="raffle-info absolute w-auto bottom-[95%] right-0 px-4 py-2 rounded-xl bg-red-500">
                                    <h2 className='md:text-sm text-xs font-normal leading-tight'>Increase your chance to win<br />a rare NFT by collecting<br />the Raffle Tickets!</h2>
                                </div>}
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
                            <h2 className='spartan-medium md:text-lg text-md py-2 text-green md:text-left text-center des'>Description</h2>
                            <h6 className='saprtan-medium description-text md:text-md text-sm py-1 md:text-left text-center leading-tight'>{overlayArt.arttitle}</h6>
                            {/* <h6 className='saprtan-medium description-text md:text-md text-sm py-1 md:text-left text-center leading-tight'>A white skin tone and glassy skin which contains the Girl with purple hair in a ice background, looking at a top angle of the camera view.</h6> */}
                            <div className="tickets flex items-center md:justify-start justify-center gap-2 py-2">
                                <h5 className='text-white text-md'>Owned Tickets</h5>
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
                                <h3 className='coin-count spartan-semibold md:text-lg text-md'><span className='text-red-500'>{raffleTicketAmount()}</span> GFXvs Coins</h3>
                                <div className="collect-btn flex items-center gap-2 justify-center py-[0.5rem] px-[3rem] rounded-[0.8rem]" onClick={() => onVote(overlayArt._id)}>
                                    <InlineSVG
                                        src='/icons/gfx-point.svg'
                                        className='fill-current point-c w-8 h-8'
                                    />
                                    <h3 className='spartan-semibold text-white collect-text'>{loading ? "Collecting" : "Collect"}</h3>
                                    {loading && <div role="status">
                                        <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {success && <Toast
                success={true}
                message={"Raffle Tickets Collected!"}
                onClose={() => setSuccess(false)}
            />}
        </>

    );
};

export default CardHolder;
// CardHolder.tsx