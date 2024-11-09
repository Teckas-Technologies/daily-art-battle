"use client";
import InlineSVG from 'react-inlinesvg';
import './Header.css';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const navs = [
    { id: "leaderboard", label: "Leaderboard", path: "/leaderboard" },
    { id: "campaigns", label: "Campaigns", path: "/campaign" },
    { id: "artbattles", label: "Art Battles", path: "/" },
];

export const Header: React.FC = () => {
    const pathName = usePathname();

    return (
        <div className="header fixed bg-black h-[7rem] w-full z-50 top-0 left-0 flex items-center justify-between md:px-[7rem] px-3">
            <div className="header-left flex items-center justify-center px-4 gap-5 rounded-[7rem] md:px-10 py-2">
                <div className="nav-links-logo flex items-center gap-2">
                    <div className="img md:h-11 md:w-11 h-9 w-9">
                        <img src="/images/logo.png" alt="logo" className="w-full h-full" />
                    </div>
                    <h2 className="text-white hidden md:block spartan-bold font-bold text-lg">GFXvs</h2>
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
                            <h3 key={index} className={`text-white cursor-pointer font-semibold spartan-semibold text-sm ${pathName === nav.path ? 'active' : ''}`}> {/* add "active" class for active menu */}
                                {nav?.label}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="header-right flex items-center md:gap-4 gap-2">
                <InlineSVG
                    src="/icons/wallet.svg"
                    className="md:h-11 md:w-11 h-8 w-8"
                />
                <div className="header-actions flex items-center gap-3">
                    <h2 className='font-semibold spartan-semibold'>Login |</h2>
                    <div className="outside rounded-3xl">
                        <div className="layer2 rounded-3xl">
                            <div className="register-btn px-5 py-2 rounded-3xl cursor-pointer">
                                <h2 className='font-bold spartan-semibold'>Get Started</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="outside rounded-xl">
                    <div className="layer2 rounded-xl">
                        <div className="header-info flex items-center gap-3 px-5 py-2 rounded-xl">
                            <div className="profile-icon p-[0.4rem] rounded-full">
                                <InlineSVG
                                    src="/icons/profile.svg"
                                    className="fill-current md:h-4 md:w-4 h-3 w-3 text-white"
                                />
                            </div>
                            <div className="name-id hidden md:block">
                                <h2 className='spartan-bold font-bold text-md text-center'>Johnson</h2>
                                <h4 className='spartan-light text-sm text-center email'>johnson794544@gmail.com</h4>
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
                                    <h2 className='md:spartan-bold spartan-semibold text-center font-bold'>2000</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};
