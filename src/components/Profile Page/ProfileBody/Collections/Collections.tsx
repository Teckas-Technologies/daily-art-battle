import InlineSVG from "react-inlinesvg"
import "./Collections.css"

const collectionsMenu = [
    { id: "rare", label: "Rare NFTs" },
    { id: "participant", label: "Participation NFTs" },
    { id: "raffle", label: "Raffle Tickets" }
]

export const Collections: React.FC = () => {
    return (
        <div className="collections mb-20 pb-20">
            <div className="collections-menus w-full flex items-center justify-between my-10">
                {collectionsMenu.map((menu, index) => (
                    <div
                        key={menu.id}
                        className="collections-menu w-[23rem] flex flex-col justify-center items-center pt-6 pb-4 px-4 rounded-[1rem]"
                    >
                        <h2 className="font-semibold text-[1.5rem] text-white leading-tight">
                            {menu.label}
                        </h2>
                        <h4 className="font-semibold text-[3rem] text-green leading-tight">
                            4
                        </h4>
                        <div className="go-to w-full flex justify-end">
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
            </div>
        </div>
    )
}
