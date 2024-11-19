"use client";

import InlineSVG from "react-inlinesvg";
import "./Popup.css";
import useMintImage from "@/hooks/useMint";
import { ArtData } from "@/hooks/artHooks";
import { NftToken, RaffleArt } from "@/types/types";

interface Props {
    info: string;
    text: string;
    isMint: boolean;
    onClose: () => void;
    art: ArtData | NftToken | RaffleArt;
}

export const MintBurnPopup: React.FC<Props> = ({ info, text, isMint, onClose, art }) => {
    const { mintImage } = useMintImage();

    const isRaffleArt = (data: ArtData | NftToken | RaffleArt): data is RaffleArt => "raffleCount" in data;

    const handleConfirm = async () => {
        if (isMint) {
            console.log("Mint initiated!");
            if(isRaffleArt(art)) {
                mintImage({ title: art?.colouredArt, mediaUrl: art?.colouredArt, referenceUrl: art?.colouredArtReference, count: 5, contractId: "" })
            }
        } else {
            console.log("Burn initiated!");
        }

    }

    return (
        <div className="sign-in-popup fixed top-0 bottom-0 left-0 right-0 z-50 h-full flex items-center justify-center px-3">
            <div className="signin-card w-[25rem] h-auto lg:p-8 md:p-6 p-4 rounded-2xl bg-black">
                <div className="close-art w-full flex justify-end">
                    <div className="close-icon w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-md cursor-pointer" onClick={onClose}>
                        <InlineSVG
                            src="/icons/close.svg"
                            className="md:w-4 md:h-4 w-3 h-3 spartan-light"
                        />
                    </div>
                </div>
                <h6 className='text-center text-xs leading-tight font-light py-2'>{info}</h6>
                <h2 className='text-green font-bold text-lg text-center py-3' dangerouslySetInnerHTML={{ __html: text }}></h2>
                <div className="popup-btns w-full flex justify-center items-center gap-3 py-1 mb-5">
                    <div className="cancel-btn px-10 py-2 rounded-3xl cursor-pointer" onClick={onClose}>
                        <h2 className='font-semibold text-md'>Cancel</h2>
                    </div>
                    <div className="signin-outer w-auto rounded-3xl cursor-pointer">
                        <div className="signin-btn px-10 py-2 rounded-3xl cursor-pointer" onClick={handleConfirm}>
                            <h2>Sign in</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
