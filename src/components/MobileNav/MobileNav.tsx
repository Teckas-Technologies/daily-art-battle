"use client";
import InlineSVG from 'react-inlinesvg';
import './MobileNav.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
    openNav: boolean;
    setOpenNav: (e: boolean) => void;
    toggleUploadModal: () => void;
    uploadSuccess: boolean;
    campaignId: string;
    fontColor: string;
    setSignToast: (e: boolean) => void;
    setErrMsg: (e: string) => void;
}

const menus = [
    {
        id: "artbattles", label: "ART BATTLES", path: "/", icon: "/images/Battle_Icon.png",
        subMenu: { id: "prevbattles", label: "PREVIOUS BATTLES", path: "/previousbattles", icon: "/images/right-arrow.png" }
    },
    { id: "leaderboard", label: "LEADERBOARD", path: "/leaderboard", icon: "/images/Trophy_Icon.png" },
    { id: "campaigns", label: "CAMPAIGNS", path: "/campaign", icon: "/images/Campaign_Icon.png" },
    { id: "create", label: "CREATE", path: "/", icon: "/images/Create_Icon.png" },
];

export const MobileNav: React.FC<Props> = ({ openNav, setOpenNav, toggleUploadModal, uploadSuccess, campaignId, fontColor, setSignToast, setErrMsg }) => {
    const [subMenu, setSubMenu] = useState(false);
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    let userDetails = user;
    // useEffect(() => {
    //     const openupload = searchParams?.get('openupload');
    //     if (openupload === 'true') {
    //         toggleUploadModal();
    //     }
    // }, [searchParams]);
    return (
        <div className={`mobile-nav fixed z-40 w-full h-auto ${openNav ? "top-0" : "top-[-100%]"} md:hidden flex flex-col pt-[7rem] bg-red bg-black`}>
            <div className="mob-menus w-full px-[2rem]">
                {menus.map((menu) => (
                    <div key={menu.id}>
                        {menu.id === "create" ? (
                            <>
                                <div
                                    className="mob-menu w-full flex items-center py-3 px-2"
                                    onClick={() => {
                                        if (!userDetails) {
                                            setOpenNav(false);
                                            setSignToast(true);
                                            setErrMsg("Sign In to upload your Art!");
                                            return;
                                        }
                                        if (pathName === "/") {
                                            setOpenNav(false);
                                            toggleUploadModal();
                                        } else {
                                            router.push(`${menu?.path}?openupload=true`);
                                        }
                                    }}
                                >
                                    <div className="menu-left w-full flex items-center gap-2">
                                        <div className="mob-icon-holder w-[1.5rem] h-[1.5rem]">
                                            <img src={menu.icon} alt="gfxvs" className="w-full h-full object-cover" />
                                        </div>
                                        <h2 className="text-[0.9rem]">{menu.label}</h2>
                                    </div>
                                    <div className="menu-right w-2 h-5">
                                        <img src="/images/right-arrow.png" alt="gfxvs" className='w-full h-full object-cover' />
                                    </div>
                                </div>
                                <InlineSVG
                                    src="/icons/mobile-nav-border.svg"
                                    className="h-6 w-full"
                                />
                            </>
                        ) : (
                            <Link href={menu?.path} key={menu.id}>
                                <div className="mob-menu w-full flex items-center py-3 px-2" onClick={() => setSubMenu(!subMenu)}>
                                    <div className="menu-left w-full flex items-center gap-2">
                                        <div className="mob-icon-holder w-[1.5rem] h-[1.5rem]">
                                            <img src={menu?.icon} alt="gfxvs" className='w-full h-full object-cover' />
                                        </div>
                                        <h2 className='text-[0.9rem]'>{menu?.label}</h2>
                                    </div>
                                    <div className="menu-right w-2 h-5">
                                        <img src="/images/right-arrow.png" alt="gfxvs" className='w-full h-full object-cover' />
                                    </div>
                                </div>
                                {/* {menu?.id === "artbattles" && subMenu &&
                            <Link href={menu?.subMenu?.path ?? ""}>
                                <div className="mob-submenu flex items-center justify-between py-3 pl-6 pr-2">
                                    <div className="menu-left w-full flex items-center gap-3">
                                        <div className="mob-icon-holder w-2 h-5">
                                            <img src={menu?.subMenu?.icon} alt="gfxvs" className='w-full h-full object-cover' />
                                        </div>
                                        <h2 className='text-[0.9rem]'>{menu?.subMenu?.label}</h2>
                                    </div>
                                </div>
                            </Link>
                        } */}
                                <InlineSVG
                                    src="/icons/mobile-nav-border.svg"
                                    className="h-6 w-full"
                                />
                            </Link>
                        )}
                    </div>
                ))}
            </div>
            <div className="mob-nav-close w-full flex justify-end pr-6 py-6">
                <h3 className='text-green underline pb-2' onClick={() => setOpenNav(false)}>Close</h3>
            </div>
        </div>
    )
}