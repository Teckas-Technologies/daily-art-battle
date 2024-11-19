import "./Uploads.css"
import InlineSVG from "react-inlinesvg";
import { ArtData } from "@/hooks/artHooks";
import { ConfirmPopupInfo, NftToken } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/config/constants";

interface UploadsCardProps {
    art: ArtData | NftToken;
    isNFT: boolean;
    isUploaded: boolean;
    setConfirmPopup: (e: ConfirmPopupInfo) => void;
}

const socials = [
    { id: "facebook", label: "Facebook", icon: "/images/facebook_r.png", link: "https://www.facebook.com/sharer/sharer.php?text=Collect%20and%20win!%0A&u=" },
    { id: "twitter", label: "Twitter", icon: "/images/twitter_r.png", link: "https://twitter.com/intent/tweet?text=Collect%20and%20win!%0A&url=" },
    { id: "telegram", label: "Telegram", icon: "/images/telegram_r.png", link: "https://telegram.me/share/url?text=Collect%20and%20win!%0A&url=" }
]

export const UploadsCard: React.FC<UploadsCardProps> = ({ art, isNFT, isUploaded, setConfirmPopup }) => {

    const [artOverlay, setArtOverlay] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);

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

    const isArtData = (data: ArtData | NftToken): data is ArtData =>
        "colouredArt" in data;
    // "uploadedTime" in data &&
    // "artistName" in data &&
    // "raffleTickets" in data;

    const isArtDataRaffle = (data: ArtData | NftToken): data is ArtData =>
        "uploadedTime" in data &&
        "raffleTickets" in data;

    const artId = isArtData(art) && art?._id;

    const handleMint = () => {
        setConfirmPopup({ info: "Mint NFT", text: "Mint this NFT to get Participation NFT", isMint: true });
    }

    const handleBurn = () => {
        setConfirmPopup({ info: "Earn GFXvs Points", text: "Burn this rare NFT for<br />1000 GFXvs Coins", isMint: false });
    }

    return (
        <div className="uploads-card w-auto gap-0 md:rounded-[1.25rem] rounded-[1rem] md:mt-5 mt-0 shadow-md p-[0.5rem] flex flex-col items-center">
            <div className="relative art-img xxl:w-[17.5rem] xxl:h-[17.5rem] xl:w-[14rem] xl:h-[14rem] lg:w-[15rem] lg:h-[15rem] md:w-[15rem] md:h-[15rem] w-[10rem] h-[10rem] rounded-lg" >
                <img src={isArtData(art) ? art?.colouredArt : art?.media as string} alt={isArtData(art) ? art?.artistName : art?.owner} className="w-full h-full object-cover rounded-lg" />
                <div className={`overlay-holder absolute bottom-0 w-full h-full flex ${isUploaded ? "justify-end" : "justify-center"} items-end`}>
                    {isNFT && <div className="burn-btn md:px-6 md:py-3 px-4 py-2 md:mb-5 mb-3 md:rounded-lg rounded-md cursor-pointer" onClick={handleBurn}>
                        <h2 className="text-green font-medium md:text-md text-sm">Burn NFT</h2>
                    </div>}
                    {!isNFT && !isUploaded && <div className="mint-btn md:px-6 md:py-3 px-4 py-2 md:mb-5 mb-3 md:rounded-lg rounded-md cursor-pointer" onClick={handleMint}>
                        <h2 className="text-green font-medium md:text-md text-sm">Mint NFT</h2>
                    </div>}
                    {isUploaded && <div className="art-share px-3 py-[0.15rem] flex items-center gap-1 rounded-[2.5rem] mr-3 mb-3 cursor-pointer" onClick={handleOverlay}>
                        <h4 className="text-xs cursor-pointer font-semibold">Share</h4>
                        <InlineSVG
                            src="/icons/share-icon.svg"
                            color="#00FF00"
                            className="fill-current w-3 h-3 spartan-medium cursor-pointer"
                        />
                    </div>}
                </div>
                {isUploaded && artOverlay && <div ref={overlayRef} className="art-share-overlay absolute bottom-0 w-full h-full flex justify-center items-center">
                    <div className="social-shares flex items-center justify-center md:gap-2 gap-1">
                        {socials.map((social, index) => (
                            <a key={index} href={`${social.link + BASE_URL + "?artId=" + artId}`} className="social-share md:w-[3rem] md:h-[3rem] w-[2.2rem] h-[2.2rem] flex justify-center items-center bg-white rounded-full cursor-pointer" target="_blank" rel="noopener noreferrer">
                                <div className="share-icon-holder md:w-[1.8rem] md:h-[1.8rem] w-[1.5rem] h-[1.5rem]">
                                    <img src={social.icon} alt={social.label} className="w-full h-full object-cover" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>}
            </div>
            <div className={`uploads-bottom w-full flex justify-between gap-1 items-center pt-2 px-1 ${!isArtData(art) && "hidden"}`}>
                <div className="date">
                    <h2 className="uploads-text">{isArtData(art) && formatDate(art?.uploadedTime)}</h2>
                </div>
                {isArtDataRaffle(art) && <div className="collects flex items-center gap-1">
                    <InlineSVG
                        src="/icons/red-heart.svg"
                        className="w-4 h-4 spartan-light"
                    />
                    <h2 className="uploads-text">{isArtData(art) && art?.raffleTickets as number}</h2>
                    <h2 className="uploads-text hidden md:flex">Collects</h2>
                </div>}
            </div>
        </div>
    )
}