"use client";
import InlineSVG from 'react-inlinesvg';
import './Header.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NearContext } from '@/wallet/WalletSelector';

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

const navs = [
    { id: "battles", label: "Battles", path: "/", icon: "/images/Battle_Icon.png" },
    { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: "/images/Trophy_Icon.png" },
    { id: "campaigns", label: "Campaigns", path: "/campaign", icon: "/images/Campaign_Icon.png" },
    { id: "create", label: "Create", path: "/", icon: "/images/Create_Icon.png" },
];

export const Header: React.FC<Props> = ({ openNav, setOpenNav, toggleUploadModal, uploadSuccess, campaignId, fontColor, setSignToast, setErrMsg }) => {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { wallet, signedAccountId } = useContext(NearContext);
    const [walletIcon, setWalletIcon] = useState("/icons/wallet-red.svg");
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    const { user, signInUser, signOutUser } = useAuth();
    let userDetails = user;
    const profileMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (pathName === "/profile" && !userDetails) {
            router.push("/");
        }
    }, [pathName, userDetails, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setOpenProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (signedAccountId) {
            setWalletIcon("/icons/wallet.svg");
        }
        if (!signedAccountId) {
            setWalletIcon("/icons/wallet-red.svg");
        }
    }, [signedAccountId, userDetails]);

    useEffect(() => {
        const openupload = searchParams?.get('openupload');
        if (openupload === 'true') {
            toggleUploadModal();
        }
    }, [pathName, searchParams]);

    const handleSignIn = async () => {
        await wallet?.signIn();
    }

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
                            onClick={() => setOpenNav(!openNav)}
                        />
                    </div>
                </div>
                <div className="nav-links hidden md:flex gap-5">
                    {navs.map((nav, index) => (
                        <div key={nav?.id}>
                            {nav.id === "create" ? (
                                <>
                                    <h3 key={index} className={`flex items-center gap-1 text-white cursor-pointer font-medium spartan-medium text-sm`} onClick={() => {
                                        if (!userDetails) {
                                            setSignToast(true);
                                            setErrMsg("Sign In to upload your Art!");
                                            return;
                                        }
                                        if (pathName === "/") {
                                            toggleUploadModal();
                                        } else {
                                            router.push(`${nav?.path}?openupload=true`);
                                        }
                                    }}>
                                        <div className={`md:hidden lg:block w-[1.5rem] h-[1.5rem]`}>
                                            <img src={nav.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                        </div>
                                        {nav?.label}
                                    </h3>
                                </>
                            ) : (
                                <Link href={nav?.path}>
                                    <h3 key={index} className={`flex items-center gap-1 text-white cursor-pointer font-medium spartan-medium text-sm ${pathName === nav.path ? 'active' : ''}`}> {/* add "active" class for active menu */}
                                        <div className={`md:hidden lg:block ${nav.id === "battles" || nav?.id === "campaigns" ? "w-[1.3rem] h-[1.3rem]" : "w-[1.5rem] h-[1.5rem]"}`}>
                                            <img src={nav.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                        </div>
                                        {nav?.label}
                                    </h3>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="header-right flex items-center md:gap-3 gap-2">
                {userDetails && <InlineSVG
                    src={walletIcon}
                    className="md:h-11 md:w-11 h-8 w-8 cursor-pointer"
                    onClick={() => { signedAccountId ? router.push("/profile") : handleSignIn() }}
                />}
                {!userDetails && <div className="header-actions flex items-center gap-3">
                    {/* <h2 className='font-semibold spartan-semibold'>Login |</h2> */}
                    <div className="outside rounded-3xl" onClick={signInUser}>
                        <div className="layer2 rounded-3xl">
                            <div className="register-btn px-10 py-2 rounded-3xl cursor-pointer">
                                <h2 className='font-bold spartan-semibold'>Login</h2>
                            </div>
                        </div>
                    </div>
                </div>}

                {userDetails &&
                    <div className="outside relative rounded-xl cursor-pointer" onClick={() => setOpenProfileMenu(!openProfileMenu)}>
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
                        {openProfileMenu && <div ref={profileMenuRef} className="profile-dd absolute top-[100%] right-0 md:w-full w-[125%] h-auto rounded-[0.75rem] md:p-6 p-4">
                            <div className="profile-menus flex flex-col gap-5">
                                <Link href={"/profile"}>
                                    <div className="goto-profile flex items-center justify-start gap-2 cursor-pointer">
                                        <InlineSVG
                                            src="/icons/circle-profile.svg"
                                            className="h-5 w-5"
                                        />
                                        <h2>Go to profile</h2>
                                    </div>
                                </Link>
                                <div className="wallet-history flex items-center justify-start gap-2 cursor-pointer">
                                    <InlineSVG
                                        src="/icons/swap.svg"
                                        className="h-5 w-5"
                                    />
                                    <h2>Transaction History</h2>
                                </div>
                            </div>
                            <div className="signout-btn flex items-center justify-center gap-2 rounded-md py-2 mt-5 cursor-pointer" onClick={signOutUser}>
                                <InlineSVG
                                    src="/icons/signout.svg"
                                    className="h-5 w-5"
                                />
                                <h2 className='text-green'>Sign out</h2>
                            </div>
                        </div>}
                    </div>
                }
            </div>
        </div>
    );
};
