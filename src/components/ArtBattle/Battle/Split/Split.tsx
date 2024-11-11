"use client";
import { useEffect, useState } from 'react';
import './Split.css';
import InlineSVG from 'react-inlinesvg';
import { ArtData, useFetchArtById } from '@/hooks/artHooks';
import { BuyRafflePopup } from '../../RafflePopup/BuyRafflePopup';
import { useArtsRaffleCount } from '@/hooks/useRaffleTickets';
import { Artwork } from '../Battle';
import Toast from '@/components/Toast';

interface Props {
    artA: Artwork,
    artB: Artwork,
    campaignId: string;
    artATickets: number;
    artBTickets: number;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Split: React.FC<Props> = ({ artA, artB, campaignId, artATickets, artBTickets, setRefresh }) => {
    const { fetchArtById } = useFetchArtById();
    const { fetchArtUserRaffleCount } = useArtsRaffleCount();
    const [showOverlayA, setShowOverlayA] = useState(false);
    const [showOverlayB, setShowOverlayB] = useState(false);
    const [selectedArtId, setSelectedArtId] = useState(null);
    const [overlayArt, setoverlayArt] = useState<ArtData | null>(null);
    const [success, setSuccess] = useState(false);
    const [artAMyTickets, setArtAMyTickets] = useState<number>(0);
    const [artBMyTickets, setArtBMyTickets] = useState<number>(0);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        if (err) {
            setTimeout(() => setErr(false), 3000);
        }
    }, [err])

    // Toggle overlay visibility
    const toggleOverlayA = () => {
        setShowOverlayA(!showOverlayA);
        setShowOverlayB(false);
    }
    const toggleOverlayB = () => {
        setShowOverlayB(!showOverlayB);
        setShowOverlayA(false);
    }

    const handleImageClick = async (id: any) => {
        setSelectedArtId(id);
        setSuccess(false);
        console.log(id)
        const overlay = await fetchArtById(id);
        setoverlayArt(overlay);
        const url = new URL(window.location.href);
        url.searchParams.set('artId', id);
        window.history.pushState({}, '', url.toString());
    };

    useEffect(() => {
        if (artA && campaignId) {
            const fetchArtAUsertickets = async () => {
                const tickets = await fetchArtUserRaffleCount(artA?.id as string, campaignId);
                if (tickets !== undefined && tickets !== null) {
                    setArtAMyTickets(tickets);
                }
            };
            fetchArtAUsertickets();
        }

        if (artB && campaignId) {
            const fetchArtBUsertickets = async () => {
                const tickets = await fetchArtUserRaffleCount(artB?.id as string, campaignId);
                if (tickets !== undefined && tickets !== null) {
                    setArtBMyTickets(tickets);
                }
            };
            fetchArtBUsertickets();
        }

    }, [artA, artB, overlayArt, selectedArtId, success])

    return (
        <>
            {/* Split battle starts */}
            <div className="flex md:flex-row flex-col w-full justify-center items-center mt-5">
                <div className="hero-left flex md:flex-row flex-col justify-end items-center md:w-[50%] w-full md:pr-[3.5rem] ">
                    <div className="relative arta xl:w-[24.5rem] xl:h-[26rem] lg:w-[22.5rem] lg:h-[24rem] md:w-[20.5rem] md:h-[22rem] w-[17rem] h-[17rem] rounded-2xl cursor-pointer" onClick={toggleOverlayA}>
                        <img src={artA.imageUrl} alt={artA.title} className='w-full h-full rounded-2xl' />
                        <div className='overlay w-full flex flex-col absolute bottom-0 left-0 rounded-b-2xl'>
                            <div className="lay w-full flex h-20">
                            </div>
                            <div className="art-overlay w-full h-auto text-white flex items-end md:px-5 md:pb-5 p-1">
                                <div className="p-2 pt-0 w-full">
                                    <h3 className="md:text-xl text-md font-bold spartan-semibold">{artA.artistId}</h3>
                                    <p className="text-sm">{artA.title} by {artA.artistId}</p>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute bottom-0 w-full flex items-center justify-end px-3 pb-4`}>
                            <div className="like w-[2.5rem] h-[2.5rem] bg-white flex justify-center items-center rounded-full" onClick={() => handleImageClick(artA?.id)}>
                                <InlineSVG
                                    src={`/icons/${artAMyTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                                    className="w-7 h-7 spartan-medium"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mob-vote-btn w-full md:hidden flex justify-center">
                        <div className={`vote-btn w-full flex justify-center md:justify-end mt-5 mb-10 pb-5`}>
                            <div className="outside w-auto h-auto rounded-3xl">
                                <div className="second-layer w-auto h-auto rounded-3xl">
                                    <button className={` battle-vote-btn px-6 py-3 rounded-3xl cursor-pointer`}>
                                        <h2 className="md:spartan-bold spartan-semibold font-bold text-xs md:text-sm">Total Collects <span className='text-green'>{artATickets}</span></h2>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-right flex md:flex-row flex-col justify-start items-center md:w-[50%] w-full md:pl-[3.5rem]">
                    <div className="relative artb xl:w-[24.5rem] xl:h-[26rem] lg:w-[22.5rem] lg:h-[24rem] md:w-[20.5rem] md:h-[22rem] w-[17rem] h-[17rem] rounded-2xl cursor-pointer" onClick={toggleOverlayB}>
                        <img src={artB.imageUrl} alt={artB.title} className='w-full h-full rounded-2xl' />
                        <div className="overlay w-full flex flex-col rounded-b-2xl">
                            <div className="lay w-full flex h-20">
                            </div>
                            <div className="art-overlay w-full h-auto text-white flex items-end md:px-5 md:pb-5 p-1">
                                <div className="p-2 pt-0 w-full">
                                    <h3 className="md:text-xl text-md font-bold spartan-semibold">{artB.artistId}</h3>
                                    <p className="text-sm">{artB.title} by {artB.artistId}</p>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute bottom-0 w-full flex items-center justify-end px-3 pb-4`}>
                            <div className="like w-[2.5rem] h-[2.5rem] bg-white flex justify-center items-center rounded-full" onClick={() => handleImageClick(artB?.id)}>
                                <InlineSVG
                                    src={`/icons/${artBMyTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                                    className="w-7 h-7 spartan-medium"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mob-vote-btn w-full md:hidden flex justify-center">
                        <div className={`vote-btn w-full flex justify-center md:justify-end mt-5 mb-5`}>
                            <div className="outside w-auto h-auto rounded-3xl">
                                <div className="second-layer w-auto h-auto rounded-3xl">
                                    <button className={` battle-vote-btn px-5 py-3 rounded-3xl cursor-pointer`}>
                                        <h2 className="md:spartan-bold spartan-semibold font-bold text-xs md:text-sm">Total Collects <span className='text-green'>{artBTickets}</span></h2>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedArtId && overlayArt && <BuyRafflePopup overlayArt={overlayArt} setRefresh={setRefresh} campaignId={campaignId} setSuccess={setSuccess} myTickets={overlayArt?._id === artA?.id ? artAMyTickets : artBMyTickets} setSelectedArtId={setSelectedArtId} setErr={setErr} setErrMsg={setErrMsg} />}
                {success && <Toast
                    success={true}
                    message={"Raffle Tickets Collected!"}
                    onClose={() => setSuccess(false)}
                />}
                {/* {err && <Toast
                    success={false}
                    message={errMsg}
                    onClose={() => setErr(false)}
                />} */}
            </div>
        </>
    )
}