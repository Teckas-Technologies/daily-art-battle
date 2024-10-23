"use client";
import { useState } from 'react';
import './Split.css';
import { useMbWallet } from '@mintbase-js/react';

interface ViewTool {
    id: string;
    path: string;
    active: boolean;
}

interface Props {
    artA: any,
    artB: any,
    onVote: (id: string) => void;
    success: boolean;
    votedFor: string;
    viewTools: ViewTool[];
}

export const Split: React.FC<Props> = ({ artA, artB, onVote, success, votedFor, viewTools }) => {

    const { isConnected, connect, activeAccountId } = useMbWallet();
    const [showOverlayA, setShowOverlayA] = useState(false);
    const [showOverlayB, setShowOverlayB] = useState(false);

    // Toggle overlay visibility
    const toggleOverlayA = () => {
        setShowOverlayA(!showOverlayA);
        setShowOverlayB(false);
    }
    const toggleOverlayB = () => {
        setShowOverlayB(!showOverlayB);
        setShowOverlayA(false);
    }

    return (
        <>
            {/* Split battle starts */}
            <div className="flex md:flex-row flex-col w-full justify-center items-center mt-5">
                <div className="hero-left flex md:flex-row flex-col justify-end items-center md:w-[50%] w-full md:pr-[3.5rem] ">
                    <div className="relative arta md:w-[24.5rem] md:h-[26.5rem] w-[16rem] h-[18rem] rounded-2xl cursor-pointer" onClick={toggleOverlayA}>
                        <img src={artA.imageUrl} alt={artA.title} className='w-full h-full rounded-2xl' />
                        {showOverlayA && (
                            <div className="art-overlay absolute bottom-0 left-0 w-full h-auto pt-[10rem] text-white flex items-end md:p-5 p-1 rounded-b-2xl">
                                <div className="p-2 w-full">
                                    <h3 className="md:text-xl text-md font-bold spartan-semibold">{artA.artistId}</h3>
                                    <p className="text-sm">{artA.title} by {artA.artistId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mob-vote-btn w-full md:hidden flex justify-center">
                        <div className={`vote-btn w-full flex justify-center md:justify-end mt-5 mb-10 pb-5`}>
                            <div className="outside w-auto h-auto rounded-3xl">
                                <div className="second-layer w-auto h-auto rounded-3xl">
                                    <button
                                        onClick={() => onVote(artA.id)}
                                        disabled={!isConnected || success}
                                        className={` battle-vote-btn px-5 py-3 rounded-3xl cursor-pointer ${!isConnected || success ? "cursor-not-allowed" : ""}`}
                                    >
                                        <h2 className="md:spartan-bold spartan-semibold font-bold text-xs md:text-sm">
                                            {votedFor === artA.name
                                                ? "Voted Art A"
                                                : viewTools[1]?.active || viewTools[2]?.active
                                                    ? "Vote for Art A"
                                                    : "Vote here"}
                                        </h2>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-right flex md:flex-row flex-col justify-start items-center md:w-[50%] w-full md:pl-[3.5rem]">
                    <div className="relative artb md:w-[24.5rem] md:h-[26.5rem] w-[16rem] h-[18rem] rounded-2xl cursor-pointer" onClick={toggleOverlayB}>
                        <img src={artB.imageUrl} alt={artB.title} className='w-full h-full rounded-2xl' />
                        {showOverlayB && (
                            <div className="art-overlay absolute bottom-0 left-0 w-full h-auto pt-[10rem] text-white flex items-end md:p-5 p-1 rounded-b-2xl">
                                <div className="p-2 w-full">
                                    <h3 className="md:text-xl text-md font-bold spartan-semibold">{artB.artistId}</h3>
                                    <p className="text-sm">{artB.title} by {artB.artistId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mob-vote-btn w-full md:hidden flex justify-center">
                        <div className={`vote-btn w-full flex justify-center md:justify-end mt-5 mb-5`}>
                            <div className="outside w-auto h-auto rounded-3xl">
                                <div className="second-layer w-auto h-auto rounded-3xl">
                                    <button
                                        // onClick={() => onVote(artA.id)}
                                        // disabled={!isConnected || success}
                                        className={` battle-vote-btn px-5 py-3 rounded-3xl cursor-pointer`} //${!isConnected || success ? "cursor-not-allowed" : ""}
                                    >
                                        <h2 className="md:spartan-bold spartan-semibold font-bold text-xs md:text-sm">
                                            {/* {votedFor === artA.name
                                                ? "Voted Art A"
                                                : viewTools[1].active || viewTools[2].active
                                                    ? "Vote for Art A"
                                                    : "Vote here"} */}
                                            Vote for Art A
                                        </h2>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}