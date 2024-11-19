import { ArtData } from "@/hooks/artHooks";
import { UploadsCard } from "./UploadsCard";
import { NftToken, RaffleArt } from "@/types/types";

interface UploadsHolderProps {
    artData: ArtData[] | NftToken[] | RaffleArt[] | null;
    isNFT: boolean;
    isUploaded: boolean;
}

export const UploadsHolder: React.FC<UploadsHolderProps> = ({ artData, isNFT, isUploaded }) => {
    return (
        <div className="uploads-holder grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xxl:gap-[1.5rem] xl:gap-[1.5rem] lg:gap-[1.5rem] md:gap-[1rem] gap-[0.5rem]">
            {artData?.map((art, index) => (
                <div key={index}>
                    <UploadsCard art={art} isNFT={isNFT} isUploaded={isUploaded} />
                </div>
            ))}
        </div>
    )
}