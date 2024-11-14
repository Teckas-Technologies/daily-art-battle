import "./Uploads.css"
import InlineSVG from "react-inlinesvg";
import { ArtData } from "@/hooks/artHooks";

interface UploadsCardProps {
    art: ArtData | null;
}

export const UploadsCard: React.FC<UploadsCardProps> = ({ art }) => {

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

    console.log("Art", art)

    return (
        <div className="uploads-card w-auto gap-0 md:rounded-[1.25rem] rounded-[1rem] md:mt-5 mt-0 shadow-md p-[0.5rem] flex flex-col items-center">
            <div className="relative art-img xxl:w-[17.5rem] xxl:h-[17.5rem] xl:w-[14rem] xl:h-[14rem] lg:w-[15rem] lg:h-[15rem] md:w-[15rem] md:h-[15rem] w-[10rem] h-[10rem] rounded-lg" >
                <img src={art?.colouredArt} alt={art?.artistName} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="uploads-bottom w-full flex justify-between gap-1 items-center pt-2 px-1">
                <div className="date">
                    <h2 className="uploads-text">{formatDate(art?.uploadedTime)}</h2>
                </div>
                <div className="collects flex items-center gap-1">
                    <InlineSVG
                        src="/icons/red-heart.svg"
                        className="w-4 h-4 spartan-light"
                    />
                    <h2 className="uploads-text">{art?.raffleTickets as number}</h2>
                    <h2 className="uploads-text hidden md:flex">Collects</h2>
                </div>
            </div>
        </div>
    )
}