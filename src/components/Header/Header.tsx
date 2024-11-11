"use client";
import InlineSVG from 'react-inlinesvg';
import './Header.css';
import { useRouter, usePathname } from 'next/navigation';
import { act, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserDetails } from '@/types/types';
import { useMbWallet } from '@mintbase-js/react';
import { useAuth } from '@/contexts/AuthContext';

const navs = [
    { id: "battles", label: "Battles", path: "/", icon: "/images/Battle_Icon.png" },
    { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: "/images/Trophy_Icon.png" },
    { id: "campaigns", label: "Campaigns", path: "/campaign", icon: "/images/Campaign_Icon.png" },
    { id: "create", label: "Create", path: "/create", icon: "/images/Create_Icon.png" },
];

export const Header: React.FC = () => {
    const pathName = usePathname();
    const { activeAccountId, isConnected, connect, disconnect } = useMbWallet();
    const [walletIcon, setWalletIcon] = useState("/icons/wallet-red.svg");
    const { user } = useAuth();
    let userDetails = user;

    useEffect(() => {
        if (activeAccountId && isConnected) {
            setWalletIcon("/icons/wallet.svg");
        } else {
            setWalletIcon("/icons/wallet-red.svg");
        }
    }, [activeAccountId, isConnected, userDetails]);

    console.log(`Account connected : ${userDetails?.user?.nearAddress}, ${activeAccountId}`)

    return (
        <div className="header fixed bg-black h-[7rem] w-full z-50 top-0 left-0 flex items-center justify-between xl:px-[7rem] lg:px-[3rem] md:px-[2rem] px-3">
            <div className="header-left flex items-center justify-center px-4 gap-5 rounded-[7rem] md:px-10 py-2">
                <div className="nav-links-logo flex items-center gap-2">
                    <Link href={"/"} className='flex items-center gap-2'>
                        <div className="img md:h-11 md:w-11 h-9 w-9">
                            <img src="/images/logo.png" alt="logo" className="w-full h-full" />
                        </div>
                        <h2 className="text-white hidden md:block spartan-bold font-bold text-md">GFXvs</h2>
                    </Link>
                    <div className="header-menu md:hidden">
                        <InlineSVG
                            src="/icons/menu.svg"
                            className="h-6 w-6"
                        />
                    </div>
                </div>
                <div className="nav-links hidden md:flex gap-5">
                    {navs.map((nav, index) => (
                        <Link href={nav?.path}>
                            <h3 key={index} className={`flex items-center gap-1 text-white cursor-pointer font-medium spartan-medium text-sm ${pathName === nav.path ? 'active' : ''}`}> {/* add "active" class for active menu */}
                                <div className={`md:hidden lg:block ${nav.id === "battles" || nav?.id === "campaigns" ? "w-[1.3rem] h-[1.3rem]" : "w-[1.5rem] h-[1.5rem]"}`}>
                                    <img src={nav.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                </div>
                                {nav?.label}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="header-right flex items-center md:gap-3 gap-2">
                <InlineSVG
                    src={walletIcon}
                    className="md:h-11 md:w-11 h-8 w-8 cursor-pointer"
                    onClick={() => { activeAccountId ? disconnect() : connect() }}
                />
                {!userDetails && <div className="header-actions flex items-center gap-3">
                    {/* <h2 className='font-semibold spartan-semibold'>Login |</h2> */}
                    <div className="outside rounded-3xl">
                        <div className="layer2 rounded-3xl">
                            <div className="register-btn px-10 py-2 rounded-3xl cursor-pointer">
                                <h2 className='font-bold spartan-semibold'>Login</h2>
                            </div>
                        </div>
                    </div>
                </div>}

                {userDetails && <Link href={"/profile"}>
                    <div className="outside rounded-xl">
                        <div className="layer2 rounded-xl">
                            <div className="header-info flex items-center gap-3 px-5 py-2 rounded-xl">
                                <div className="profile-icon p-[0.4rem] rounded-full">
                                    <InlineSVG
                                        src="/icons/profile.svg"
                                        className="fill-current md:h-4 md:w-4 h-3 w-3 text-white"
                                    />
                                </div>
                                <div className="name-id hidden md:block md:max-w-[8rem] lg:max-w-[10rem] xl:max-w-[12rem]">
                                    <h2 className='spartan-bold font-bold text-md text-center truncate'>{userDetails?.user?.firstName}</h2>
                                    <h4 className='spartan-light text-sm text-center email truncate'>{userDetails?.user?.email}</h4>
                                </div>
                                <div className="gfx-points flex md:flex-col md:gap-0 gap-1">
                                    <div className="point-name flex items-center gap-1">
                                        <InlineSVG
                                            src="/icons/gfx-point.svg"
                                            className="h-5 w-5"
                                        />
                                        <h2 className='spartan-semibold hidden md:block'>GFXvs</h2>
                                    </div>
                                    <div className="points">
                                        <h2 className='md:spartan-bold spartan-semibold text-center font-bold'>{userDetails?.user?.gfxCoin?.toFixed(1)}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>}
            </div>
        </div>
    );
};
