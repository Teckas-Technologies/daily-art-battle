import "./Uploads.css"
import InlineSVG from "react-inlinesvg";
import { ArtData } from "@/hooks/artHooks";
import { ConfirmPopupInfo, NftToken, RaffleArt } from "@/types/types";
import { useContext, useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/config/constants";
import { MintBurnPopup } from "@/components/PopUps/MintBurnPopup";
import { NearContext } from "@/wallet/WalletSelector";
import { useAuth } from "@/contexts/AuthContext";

interface UploadsCardProps {
    art: ArtData | NftToken | RaffleArt;
    isNFT: boolean;
    isUploaded: boolean;
    isSpinner?: boolean;
}

const socials = [
    { id: "facebook", label: "Facebook", icon: "/images/Facebook_New.png", link: `https://www.facebook.com/sharer/sharer.php?u=` }, // quote=${encodeURIComponent("Collect and win!")}
    { id: "twitter", label: "Twitter", icon: "/images/Twitter_New.png", link: "https://twitter.com/intent/tweet?text=Collect%20and%20win!%0A&url=" },
    { id: "telegram", label: "Telegram", icon: "/images/Telegram_New.png", link: "https://t.me/share/url?text=Collect%20and%20win!%0A&url=" }
]

export const UploadsCard: React.FC<UploadsCardProps> = ({ art, isNFT, isUploaded, isSpinner }) => {
    const { wallet, signedAccountId } = useContext(NearContext);
    const { user } = useAuth();
    const [artOverlay, setArtOverlay] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [confirmPopup, setConfirmPopup] = useState<ConfirmPopupInfo>({
        info: "",
        text: "",
        isMint: false
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                overlayRef.current &&
                !overlayRef.current.contains(event.target as Node)
            ) {
                setArtOverlay(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOverlay = () => {
        setArtOverlay(!artOverlay);
    }

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return "";
        const validDate = typeof date === "string" ? new Date(date) : date;
        if (isNaN(validDate.getTime())) return "";
        return validDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isArtData = (data: ArtData | NftToken | RaffleArt): data is ArtData =>
        "colouredArt" in data &&
        "artistName" in data;
    // "uploadedTime" in data &&
    // "artistName" in data &&
    // "raffleTickets" in data;

    const isNFTData = (data: ArtData | NftToken | RaffleArt): data is NftToken =>
        "media" in data;

    const isRaffleArt = (data: ArtData | NftToken | RaffleArt): data is RaffleArt =>
        "raffleCount" in data;

    const artId = isArtData(art) && art?._id;

    const handleMint = async () => {
        if (!signedAccountId) {
            await wallet?.signIn();
            return;
        }
        setConfirmPopup({ info: "Mint NFT", text: `Mint this Art to get ${isSpinner ? "Rare NFT" : "Participation NFT"}`, isMint: true });
    }
 
    const handleBurn = async () => {
        if (!signedAccountId) {
            await wallet?.signIn();
            return;
        }
        setConfirmPopup({ info: "Earn GFXvs Points", text: "Burn this rare NFT for<br />1000 GFXvs Coins", isMint: false });
    }

    const handleOffchainBurn = async () => {
        if (!user) {
            return;
        }
        console.log("Raffle Art Offchain Burn Clicked!");
        setConfirmPopup({ info: "Earn GFXvs Points", text: `Burn this ${isSpinner ? "Special" : "Participation"} Art for<br />1000 GFXvs Coins`, isMint: false });
    }

    const closeMintBurnPopup = () => {
        setConfirmPopup({ info: "", text: "", isMint: false })
    }

    return (
        <div className="uploads-card w-auto gap-0 md:rounded-[1.25rem] rounded-[1rem] md:mt-5 mt-0 shadow-md p-[0.5rem] flex flex-col items-center">
            <div className="relative art-img-holder xxl:w-[17.5rem] xxl:h-[17.5rem] xl:w-[14rem] xl:h-[14rem] lg:w-[15rem] lg:h-[15rem] md:w-[15rem] md:h-[15rem] w-[10rem] h-[10rem] rounded-lg" >
                <img src={isArtData(art) ? art?.colouredArt : isNFTData(art) ? art?.media as string : art?.colouredArt} alt={isArtData(art) ? art?.artistName : isNFTData(art) ? art?.media as string : art?.participantId} className="w-full h-full object-cover rounded-lg" />
                <div className={`overlay-holder absolute bottom-0 w-full h-full flex gap-0 ${isUploaded ? "flex-row justify-end" : "flex-col items-center justify-end"} items-end`}>
                    {isNFT && <div className="burn-btn md:px-6 md:py-3 px-4 py-2 md:mb-5 mb-3 md:rounded-lg rounded-md cursor-pointer" onClick={handleBurn}>
                        <h2 className="text-green font-medium md:text-md text-sm">Burn NFT</h2>
                    </div>}
                    {!isNFT && !isUploaded && <>
                        <div className="burn-btn md:px-6 md:py-3 px-4 py-2 mb-1 md:rounded-lg rounded-md cursor-pointer" onClick={handleOffchainBurn}>
                            <h2 className="text-green font-medium md:text-md text-sm">Burn NFT</h2>
                        </div>
                        <div className="mint-btn md:px-6 md:py-3 px-4 py-2 md:mb-5 mb-3 md:rounded-lg rounded-md cursor-pointer" onClick={handleMint}>
                            <h2 className="text-green font-medium md:text-md text-sm">Mint NFT</h2>
                        </div>
                    </>}
                    {isUploaded && <div className="art-share px-3 py-[0.15rem] flex items-center gap-1 rounded-[2.5rem] mr-3 mb-3 cursor-pointer" onClick={handleOverlay}>
                        <h4 className="text-xs cursor-pointer font-semibold">Share</h4>
                        <InlineSVG
                            src="/icons/share-icon.svg"
                            color="#000000"
                            className="fill-current w-3 h-3 spartan-medium cursor-pointer"
                        />
                    </div>}
                </div>
                {isUploaded && artOverlay && <div className="art-share-overlay absolute bottom-0 w-full h-full flex justify-center items-center">
                    <div ref={overlayRef} className="social-shares flex items-center justify-center">
                        {socials.map((social, index) => (
                            <a key={index} href={`${social.link + BASE_URL + "?artId=" + artId}`} className="social-share md:mx-0 mx-[-0.1rem] md:w-[3.6rem] md:h-[3.6rem] w-[3rem] h-[3rem] flex justify-center items-center rounded-full cursor-pointer" target="_blank" rel="noopener noreferrer">
                                {/* <div className="share-icon-holder md:w-[1.8rem] md:h-[1.8rem] w-[1.5rem] h-[1.5rem]"> */}
                                <img src={social.icon} alt={social.label} className="w-full h-full object-cover" />
                                {/* </div> */}
                            </a>
                        ))}
                    </div>
                </div>}
            </div>
            <div className={`uploads-bottom w-full flex justify-between gap-1 items-center pt-2 px-1 `}> {/** ${!isArtData(art) && "hidden"} */}
                <div className="date">
                    <h2 className="uploads-text">{isArtData(art) ? formatDate(art?.uploadedTime) : isNFTData(art) ? formatDate(art.minted_timestamp) : formatDate(art?.createdAt)}</h2>
                </div>
                {<div className="collects flex items-center gap-1">
                    <InlineSVG
                        src="/icons/red-heart.svg"
                        className="w-4 h-4 spartan-light"
                    />
                    <h2 className="uploads-text">{isArtData(art) ? art?.raffleTickets as number : isNFTData(art) ? art?.copies : art.raffleCount}</h2>
                    <h2 className="uploads-text hidden md:flex">{isNFTData(art) ? "Copies" : isArtData(art) ? "Collects" : "Collects"}</h2>
                </div>}
            </div>

            {confirmPopup.info !== "" && <MintBurnPopup info={confirmPopup?.info} text={confirmPopup?.text} isMint={confirmPopup?.isMint} onClose={() => closeMintBurnPopup()} art={art} isSpinner={isSpinner} />}
        </div>
    )
}