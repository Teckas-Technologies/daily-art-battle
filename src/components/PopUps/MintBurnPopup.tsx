"use client";

import InlineSVG from "react-inlinesvg";
import "./Popup.css";
import useMintImage from "@/hooks/useMint";
import { ArtData } from "@/hooks/artHooks";
import { NftToken, RaffleArt } from "@/types/types";
import { ART_BATTLE_CONTRACT, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import { useOffChainBurn } from "@/hooks/burnHook";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    info: string;
    text: string;
    isMint: boolean;
    onClose: () => void;
    art: ArtData | NftToken | RaffleArt;
    isSpinner?: boolean;
    setBurnArtSuccess: (e: boolean) => void;
    setBurnArtFailed: (e: boolean) => void;
}
 
export const MintBurnPopup: React.FC<Props> = ({ info, text, isMint, onClose, art, isSpinner, setBurnArtFailed, setBurnArtSuccess }) => {
    const { mintImage } = useMintImage();
    const { offchainBurn } = useOffChainBurn();
    const [burningArt, setBurningArt] = useState(false);
    const [minting, setmMinting] = useState(false);
    const { userTrigger, setUserTrigger } = useAuth();


    const isRaffleArt = (data: ArtData | NftToken | RaffleArt): data is RaffleArt => "raffleCount" in data;

    const contractId = isSpinner ? SPECIAL_WINNER_CONTRACT : ART_BATTLE_CONTRACT;
    const queryType = isSpinner ? "spinner" : "raffles";

    const handleConfirm = async () => {
        if (isMint) {
            // console.log("Mint initiated!", queryType);
            if (isRaffleArt(art)) {
                setmMinting(true);
                await mintImage({ title: "GFXvs Art Battle", mediaUrl: art?.colouredArt, artId: art?._id, queryType: queryType, referenceUrl: art?.colouredArtReference, count: art?.raffleCount, contractId: contractId })
                setmMinting(false);
            }
        } else {
            // console.log("Burn initiated!");
            if (text.includes("Art") && isRaffleArt(art)) {
                setBurningArt(true);
                const res = await offchainBurn(art._id, queryType);
                // console.log("RES NEW:", res);
                setBurningArt(false);
                if (res?.message === "Updated successfully") {
                    setUserTrigger(!userTrigger);
                    setBurnArtSuccess(true);
                } else {
                    setBurnArtFailed?.(true);
                }
                onClose();
            }
        }

    }

    return (
        <div className="sign-in-popup fixed top-0 bottom-0 left-0 right-0 z-50 h-full flex items-center justify-center px-3">
            <div className="signin-card w-[25rem] h-auto lg:p-8 md:p-6 p-4 rounded-2xl bg-black">
                {!burningArt && !minting && <div className="close-art w-full flex justify-end">
                    <div className="close-icon w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-md cursor-pointer" onClick={onClose}>
                        <InlineSVG
                            src="/icons/close.svg"
                            className="md:w-4 md:h-4 w-3 h-3 spartan-light"
                        />
                    </div>
                </div>}
                <h6 className='text-center text-xs leading-tight font-light py-2'>{info}</h6>
                <h2 className='text-green font-bold text-lg text-center py-3' dangerouslySetInnerHTML={{ __html: text }}></h2>
                {burningArt && <div className="burning w-full flex justify-center items-center gap-2 mb-3 mt-1">
                    <h4>Burning Your {isSpinner ? "Special" : "Participation"} Art</h4>
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>}
                {minting && <div className="burning w-full flex justify-center items-center gap-2 mb-3 mt-1">
                    <h4>Minting Your {isSpinner ? "Special" : "Participation"} Art</h4>
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>}
                {!burningArt && !minting && <div className="popup-btns w-full flex justify-center items-center gap-3 py-1 mb-5">
                    <div className="cancel-btn-new px-10 py-2 rounded-3xl cursor-pointer" onClick={onClose}>
                        <h2 className='font-semibold text-md'>Cancel</h2>
                    </div>
                    <div className="signin-outer w-auto rounded-3xl cursor-pointer">
                        <div className="signin-btn px-10 py-2 rounded-3xl cursor-pointer" onClick={handleConfirm}>
                            <h2>Confirm</h2>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}
