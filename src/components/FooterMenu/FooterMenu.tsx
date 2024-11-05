import InlineSVG from "react-inlinesvg";
import './FooterMenu.css';

const menus = [
    { id: "battle", label: "Battle", path: "/", icon: "/images/Battle_Icon.png", active: false },
    { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: "/images/Battle_Icon.png", active: false },
    { id: "create", label: "Create", path: "/create", icon: "/images/Create_Icon.png", active: true  },
    { id: "campaigns", label: "Campaigns", path: "/campaigns", icon: "/images/Campaign_Icon.png", active: false  },
    { id: "profile", label: "Profile", path: "/profile", icon: "/images/User_Icon.png", active: false  },
];

export const FooterMenu: React.FC = () => {
    return (
        <div className="footer-menu fixed bg-black h-[5.5rem] w-full z-40 bottom-0 left-0 flex justify-center items-center md:px-[7rem] px-3">
            <div className="menus relative w-full flex items-start md:justify-center justify-between gap-3">
                {menus.map((menu) => (
                    <div key={menu.id} className="flex flex-col items-center">
                        <div className={`menu md:w-auto md:h-auto w-[2.7rem] h-[2.7rem] flex items-center justify-center gap-3 md:px-[2rem] md:py-[0.7rem] px-3 py-3 ${menu.active ? "active" : ""}`}> {/* add active class for green border */}
                            <div className={`footer-icon ${menu.id === "create" ? "w-[2rem] h-[2rem]": "w-[2rem] h-[2rem]"}`}>
                                <img src={menu.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                            </div>
                            <h2 className="md:block hidden">{menu.label}</h2>
                        </div>
                        <h2 className={`md:hidden ${menu.active ? "flex": "hidden"}`}>{menu.label}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};
