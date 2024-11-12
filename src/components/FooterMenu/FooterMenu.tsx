"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import './FooterMenu.css';

interface Props {
    toggleUploadModal: () => void;
    uploadSuccess: boolean;
    campaignId: string;
    fontColor: string;
}

const initialMenus = [
    { id: "battle", label: "Battle", path: "/", icon: "/images/Battle_Icon.png", active: false },
    { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: "/images/Trophy_Icon.png", active: false },
    { id: "create", label: "Create", path: "/", icon: "/images/Create_Icon.png", active: false },
    { id: "campaigns", label: "Campaigns", path: "/campaign", icon: "/images/Campaign_Icon.png", active: false },
    { id: "profile", label: "Profile", path: "/profile", icon: "/images/User_Icon.png", active: false },
];

export const FooterMenu: React.FC<Props> = ({ toggleUploadModal, uploadSuccess, campaignId, fontColor }) => {
    const [menus, setMenus] = useState(initialMenus);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const updatedMenus = initialMenus.map(menu => ({
            ...menu,
            active: menu.path === pathname
        }));

        if (!updatedMenus.some(menu => menu.active)) {
            updatedMenus[0].active = true;
        }
        setMenus(updatedMenus);
    }, [pathname, uploadSuccess]);

    const handleMenuClick = (menuId: string) => {
        const updatedMenus = menus.map(menu => ({
            ...menu,
            active: menu.id === menuId
        }));
        setMenus(updatedMenus);
        const selectedMenu = updatedMenus.find(menu => menu.id === menuId);
        if (selectedMenu) {
            if (menuId === "create") {
                // toggleUploadModal();
                if (pathname === "/") {
                    toggleUploadModal();
                } else {
                    router.push(`${selectedMenu.path}?openupload=true`);
                }
            } else {
                router.push(selectedMenu.path);
            }
        }
        // const selectedMenu = updatedMenus.find(menu => menu.id === menuId);
        // if (selectedMenu) {
        //     router.push(selectedMenu.path);
        // }
    };

    return (
        <div className="footer-menu fixed bg-black h-[5.5rem] w-full z-40 bottom-0 left-0 flex justify-center items-center md:px-[7rem] px-3">
            <div className="menus relative w-full flex items-start md:justify-center justify-between gap-3">
                {menus.map((menu) => (
                    <div key={menu.id}>
                        {menu?.id === "create" ? (
                            <>
                                <div className="flex flex-col items-center">
                                    <div className={`menu md:w-auto md:h-auto w-[2.7rem] h-[2.7rem] flex items-center justify-center gap-3 md:px-[2rem] md:py-[0.7rem] px-2 py-2 cursor-pointer`} onClick={() => handleMenuClick(menu.id)}> {/* add active class for green border */}
                                        <div className={`footer-icon ${menu.id === "create" ? "w-[1.8rem] h-[1.8rem]" : "w-[1.8rem] h-[1.8rem]"}`}>
                                            <img src={menu.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                        </div>
                                        <h2 className="md:block hidden">{menu.label}</h2>
                                    </div>
                                    <h2 className={`md:hidden ${menu.active ? "flex" : "hidden"}`}>{menu.label}</h2>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className={`menu md:w-auto md:h-auto w-[2.7rem] h-[2.7rem] flex items-center justify-center gap-3 md:px-[2rem] md:py-[0.7rem] px-2 py-2 cursor-pointer ${pathname === menu.path ? "active" : ""}`} onClick={() => handleMenuClick(menu.id)}> {/* add active class for green border */}
                                    <div className={`footer-icon ${menu.id === "create" ? "w-[1.8rem] h-[1.8rem]" : "w-[1.8rem] h-[1.8rem]"}`}>
                                        <img src={menu.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                    </div>
                                    <h2 className="md:block hidden">{menu.label}</h2>
                                </div>
                                <h2 className={`md:hidden ${menu.active ? "flex" : "hidden"}`}>{menu.label}</h2>
                            </div>
                        )}
                    </div>

                ))}
            </div>
        </div>
    );
};
