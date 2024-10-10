"use client";
import { useState } from 'react';
import './Split.css';

interface Props {
    artA: any,
    artB: any
}

export const Split: React.FC<Props> = ({ artA, artB }) => {

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
            <div className="flex w-full justify-center mt-5">
                <div className="hero-left flex justify-end w-[50%] md:pr-[3.5rem] pr-[2rem]">
                    <div className="relative arta md:w-[24.5rem] md:h-[26.5rem] w-[11rem] h-[11rem] rounded-2xl cursor-pointer" onClick={toggleOverlayA}>
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
                </div>
                <div className="hero-right flex justify-start w-[50%] md:pl-[3.5rem] pl-[2rem]">
                    <div className="relative artb md:w-[24.5rem] md:h-[26.5rem] w-[11rem] h-[11rem] rounded-2xl cursor-pointer" onClick={toggleOverlayB}>
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
                </div>
            </div>
        </>
    )
}