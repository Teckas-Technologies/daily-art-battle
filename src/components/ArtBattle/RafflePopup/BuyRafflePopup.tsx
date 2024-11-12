"use state";
import Toast from "@/components/Toast";
import { RAFFLE_TICKET } from "@/config/points";
import { useAuth } from "@/contexts/AuthContext";
import { ArtData, useFetchArtById } from "@/hooks/artHooks";
import { useArtsRaffleCount } from "@/hooks/useRaffleTickets";
import { useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";

interface Props {
    overlayArt: ArtData;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    campaignId: string;
    setSuccess: (e: boolean) => void;
    myTickets: number;
    setSelectedArtId: (e: any) => void;
    setErr: (e: boolean) => void;
    setErrMsg: (e: string) => void;
    setSignToast: (e: boolean) => void;
}

export const BuyRafflePopup: React.FC<Props> = ({ overlayArt, setRefresh, campaignId, setSuccess, myTickets, setSelectedArtId, setErr, setErrMsg, setSignToast }) => {
    const { submitVote } = useArtsRaffleCount();
    const { fetchArtById } = useFetchArtById();
    const [tokenCount, setTokenCount] = useState<number | null>(1);
    const [raffleInfo, setRaffleInfo] = useState(false);
    const [insufficientBal, setInsufficientBal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    let userDetails = user;

    const handleClose = () => {
        setSelectedArtId(null);
        setTokenCount(1);
        const url = new URL(window.location.href);
        url.searchParams.delete('artId');
        window.history.pushState({}, '', url.toString());
        // setoverlayArt(null);
    };

    const onVote = async (id: string) => {
        if (!id) {
            // alert("art  not loaded!");
            setErr(true);
            setErrMsg("Art Not Loaded");
            return;
        }
        if (tokenCount == null || tokenCount === 0) {
            setErr(true);
            setErrMsg("Collect Min 1 Ticket!");
            return;
        }
        if (!userDetails) {
            setSignToast(true);
            return;
        }
        if (userDetails && userDetails?.user?.gfxCoin < raffleTicketAmount()) {
            openAndCloseSufficient();
            return;
        }
        setLoading(true);
        const success = await submitVote({
            ticketCount: tokenCount,
            artId: id,
            campaignId: campaignId
        });

        if (success) {
            setSuccess(true);
            handleClose();
            const art = await fetchArtById(id);
            console.log(art);
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
            return tokenCount * RAFFLE_TICKET;
        } else {
            return 0
        }
    }

    const openAndCloseInfo = () => {
        setRaffleInfo(true);
        setTimeout(() => setRaffleInfo(false), 5000);
    }

    const openAndCloseSufficient = () => {
        setInsufficientBal(true);
        setTimeout(() => setInsufficientBal(false), 3000);
    }

    return (
        <div className="upcoming-popup-holder fixed top-0 z-50 w-full h-full flex items-center justify-center px-3">
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
                        <h2 className='md:spartan-bold spartan-semibold text-sm md:text-lg'>{overlayArt?.artistName}</h2>
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
                        <div className="buy-tickets relative flex flex-col items-center gap-3">
                            <h3 className='coin-count spartan-semibold md:text-lg text-md flex items-center gap-2'>
                                {userDetails && userDetails?.user?.gfxCoin < raffleTicketAmount() &&
                                    <InlineSVG
                                        src='/icons/info.svg'
                                        className='fill-current text-red-400 point-c w-4 h-4 cursor-pointer'
                                        onClick={openAndCloseSufficient}
                                    />}
                                <span className={`${userDetails && userDetails?.user?.gfxCoin < raffleTicketAmount() ? "text-red-400" : ""}`}>{raffleTicketAmount()}</span> GFXvs Coins</h3>
                            {insufficientBal && <div className="raffle-info absolute w-auto bottom-[100%] left-[-1rem] px-4 py-2 rounded-xl bg-red-500">
                                <h2 className='md:text-sm text-xs font-normal leading-tight'>Insufficient GFXvs Coins!</h2>
                            </div>}
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
        </div>
    )
}


