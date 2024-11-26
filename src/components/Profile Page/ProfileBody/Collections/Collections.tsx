import InlineSVG from "react-inlinesvg"
import "./Collections.css"
import { RareNftGrid } from "./RareNftGrid/RareNftGrid"
import { useEffect, useState } from "react"
import { ParticipationNftGrid } from "./ParticipationNft/ParticipationNftGrid";
import { useFetchArtsAnalytics } from "@/hooks/profileAnalyticsHook";
import { RaffleArtsGrid } from "./RaffleTicketArts/RaffleArtsGrid";
import Marquee from "react-fast-marquee";

interface Menu {
    id: string;
    label: string;
    active: boolean;
}

const initialCollectionsMenu: Menu[] = [
    { id: "rare", label: "Rare NFTs", active: true },
    { id: "participant", label: "Participation NFTs", active: false },
    { id: "raffle", label: "Raffle Tickets", active: false }
]

interface Props {
    burnArtSuccess: boolean;
    setBurnArtSuccess: (e: boolean) => void;
    setBurnArtFailed: (e: boolean) => void;
}

export const Collections: React.FC<Props> = ({ burnArtSuccess, setBurnArtSuccess, setBurnArtFailed}) => {
    const [collectionsMenu, setCollectionsMenu] = useState(initialCollectionsMenu);
    const { analytics, fetchArtsAnalytics } = useFetchArtsAnalytics();
    const [rendered, setRendered] = useState(false);

    const handleMenuClick = (id: string) => {
        setCollectionsMenu((prevMenu) =>
            prevMenu.map((menu) => ({
                ...menu,
                active: menu.id === id,
            }))
        );
    };

    useEffect(() => {
        setRendered(!rendered);
    }, [collectionsMenu])

    useEffect(() => {
        const fetchAnalytics = async () => {
            await fetchArtsAnalytics();
        }

        fetchAnalytics();
    }, [collectionsMenu])

    return (
        <div className="collections">
            {analytics && <div className="collections-menus w-full flex md:flex-row flex-col gap-6 items-center justify-between my-10">
                {collectionsMenu.map((menu, index) => (
                    <div
                        key={menu.id}
                        onClick={() => handleMenuClick(menu.id)}
                        className={`collections-menu md:w-[23rem] w-full flex md:flex-col flex-row justify-center items-center md:gap-0 gap-2 pt-6 md:pb-4 pb-6 md:pl-4 md:pr-4 pl-4 pr-0 rounded-[1rem] cursor-pointer ${menu.active === true && "active"}`}
                    >
                        <div className="col-menu-top w-[15rem] flex flex-col items-center md:gap-0 gap-2">
                            <h2 className="font-semibold md:text-[1.5rem] text-[1rem] text-white leading-tight">
                                {menu.label}
                            </h2>
                            <h4 className="font-semibold md:text-[3rem] text-[2rem] text-green leading-tight">
                                {menu.id === "rare" ? analytics?.rareNftCount : menu.id === "participant" ? analytics?.participationCount : analytics?.raffleCount}
                            </h4>
                        </div>
                        <div className="go-to md:w-full w-auto flex justify-end">
                            <div className="redirect w-[2rem] h-[2rem] flex justify-center items-center rounded-full">
                                <InlineSVG
                                    src="/icons/right-arrow.svg"
                                    color="#000000"
                                    className="fill-current md:h-4 md:w-4 h-3 w-3"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>}

            <div className="marquee-burn w-full flex items-center h-10 mt-5">
                <Marquee speed={100}>
                    Burn your &nbsp;<b>RARE NFTS</b>&nbsp; and get 1000 GFX points &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Burn your &nbsp;<b>PARTICIPATION NFTS</b>&nbsp; and get 1000 GFX points &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Burn your &nbsp;<b>RAFFLE ARTS</b>&nbsp; and get 1000 GFX points &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Marquee>
            </div>

            {collectionsMenu[0]?.active && <RareNftGrid rendered={rendered} />}
            {collectionsMenu[1]?.active && <ParticipationNftGrid rendered={rendered} />}
            {collectionsMenu[2]?.active && <RaffleArtsGrid setBurnArtSuccess={setBurnArtSuccess} setBurnArtFailed={setBurnArtFailed} rendered={burnArtSuccess} />}
        </div>
    )
}
