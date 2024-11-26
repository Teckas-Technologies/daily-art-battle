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
    setWalletMismatchPopup: (e: boolean) => void;
}

const navs = [
    { id: "battles", label: "Battles", path: "/", icon: "/images/Battle_New.png" },
    { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: "/images/Leaderboard_New.png" },
    { id: "campaigns", label: "Campaigns", path: "/campaign", icon: "/images/Campaign_New.png" },
    { id: "create", label: "Create", path: "/", icon: "/images/Create_New.png" },
];

const subNavs = [
    { id: "currentbattles", label: "Current Battles", path: "/", icon: "/images/Battle_New.png" },
    { id: "previousbattles", label: "Previous Battles", path: "/previous", icon: "/images/Battle_New.png" },
    { id: "upcomingbattles", label: "Upcoming Battles", path: "#upcoming", icon: "/images/Battle_New.png" },
]

export const Header: React.FC<Props> = ({ openNav, setOpenNav, toggleUploadModal, uploadSuccess, campaignId, fontColor, setSignToast, setErrMsg, setWalletMismatchPopup }) => {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { wallet, signedAccountId } = useContext(NearContext);
    const [walletIcon, setWalletIcon] = useState("/icons/wallet-red.svg");
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    const { user, signInUser, signOutUser } = useAuth();
    let userDetails = user;
    const profileMenuRef = useRef<HTMLDivElement | null>(null);
    const subMenuRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subNav, setSubNav] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setIsLoading(true);
                // Simulate fetching user details
                await new Promise((resolve) => setTimeout(resolve, 10000));
                // Example: Replace the above with actual logic to fetch user details.
            } catch (error) {
                console.error("Error fetching user details", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!user) {
            fetchUserDetails();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading && pathName === "/profile" && !userDetails) {
            router.push("/");
        }
    }, [isLoading, pathName, userDetails, router]);

    // useEffect(() => {
    //     const handleRedirect = () => {
    //         if (pathName === "/profile" && !userDetails) {
    //             router.push("/");
    //         }
    //     }
    //     setTimeout(handleRedirect, 10000);
    // }, [pathName, userDetails, router]);

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
        const handleClickOutside = (event: MouseEvent) => {
            if (
                subMenuRef.current &&
                !subMenuRef.current.contains(event.target as Node)
            ) {
                setSubNav(false);
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

    useEffect(() => {
        if(signedAccountId && userDetails?.user?.nearAddress) {
            if (signedAccountId !== userDetails?.user?.nearAddress) {
                // console.log("WALLET IS INVALID!")
                setWalletMismatchPopup(true);
            }
        }
    }, [signedAccountId, userDetails]);

    const handleSignIn = async () => {
        await wallet?.signIn();
    }

    const handleSignOut = async () => {
        await wallet?.signOut();
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
                                        <div className={`md:hidden lg:block w-[1.3rem] h-[1.3rem]`}>
                                            <img src={nav.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                        </div>
                                        {nav?.label}
                                    </h3>
                                </>
                            ) : nav.id === "battles" ? <>
                                <h3 key={index} className={`relative flex items-center gap-1 text-white cursor-pointer font-medium spartan-medium text-sm ${pathName === nav.path ? 'active text-underline' : ''}`} onClick={() => setSubNav(true)}>
                                    <div className={`md:hidden lg:block w-[1.3rem] h-[1.3rem]`}>
                                        <img src={nav.icon} alt="footer-icon" className="w-full h-full bg-black object-cover" />
                                    </div>
                                    {nav?.label}

                                    {subNav && (
                                        <div ref={subMenuRef} className="sub-navs absolute top-[200%] flex flex-col gap-3 left-[-10px] w-[250%] p-3 rounded-[0.75rem]">
                                            {subNavs.map((nav, index) => {
                                                const isActive =
                                                    (nav.id === "upcomingbattles" && window.location.hash === "#upcoming") ||
                                                    (pathName === nav.path && window.location.hash !== "#upcoming");

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`sub-nav flex justify-start items-center gap-2 ${isActive ? "active" : ""}`}
                                                        onClick={() => {
                                                            // setSubNav(false);
                                                            // router.push(nav.path);
                                                            if (nav.id === "upcomingbattles") {
                                                                setSubNav(false);
                                                                router.push("/#upcoming");
                                                            } else {
                                                                setSubNav(false);
                                                                router.push(nav.path);
                                                                window.history.replaceState(null, "", window.location.pathname);
                                                            }
                                                        }}
                                                    >
                                                        <InlineSVG
                                                            src="/icons/right-arrow.svg"
                                                            color="#ffffff"
                                                            className="w-3 h-3 cursor-pointer"
                                                        />
                                                        <h2 className={`text-md font-semibold text-white ${isActive ? "active" : ""}`}>{nav.label}</h2>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </h3>
                            </> : (
                                <Link href={nav?.path}>
                                    <h3 key={index} className={`flex items-center gap-1 text-white cursor-pointer font-medium spartan-medium text-sm ${pathName === nav.path ? 'active' : ''}`}> {/* add "active" class for active menu */}
                                        <div className={`md:hidden lg:block ${nav.id === "battles" || nav?.id === "campaigns" ? "w-[1.3rem] h-[1.3rem]" : "w-[1.3rem] h-[1.3rem]"}`}>
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
                    onClick={() => { signedAccountId ? handleSignOut() : handleSignIn() }} // router.push("/profile")
                />}
                {!userDetails && <div className="header-actions flex items-center gap-3">
                    {/* <h2 className='font-semibold spartan-semibold'>Login |</h2> */}
                    <div className="outside rounded-lg" onClick={signInUser}>
                        <div className="layer2 rounded-lg">
                            <div className="register-btn px-10 py-2 rounded-lg cursor-pointer">
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
                                <div className="name-id hidden xl:block lg:hidden md:max-w-[8rem] lg:max-w-[10rem] xl:max-w-[12rem]">
                                    <h2 className='spartan-bold font-bold text-md text-center truncate'>{userDetails?.user?.firstName + " " + userDetails?.user?.lastName}</h2>
                                    <h4 className='spartan-light text-sm text-center email truncate'>{userDetails?.user?.email}</h4>
                                </div>
                                <div className="name-id hidden xl:hidden lg:block md:hidden hidden">
                                    <h2 className='spartan-bold font-bold text-lg text-center'>{userDetails?.user?.firstName.charAt(0) + userDetails?.user?.lastName.charAt(0)}</h2>
                                </div>
                                <div className="gfx-points flex lg:flex-col gap-1">
                                    <div className="point-name flex items-center gap-1">
                                        <InlineSVG
                                            src="/icons/gfx-point.svg"
                                            className="h-5 w-5"
                                        />
                                        <h2 className='spartan-semibold hidden lg:block'>GFXvs</h2>
                                    </div>
                                    <div className="points">
                                        <h2 className='md:spartan-bold spartan-semibold text-center font-bold'>{userDetails?.user?.gfxCoin?.toFixed(1)}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {openProfileMenu && <div ref={profileMenuRef} className="profile-dd absolute top-[100%] right-0 xl:w-full w-[125%] h-auto rounded-[0.75rem] md:p-6 p-4">
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
                                <Link href={"/profile?walletHistory=true"}>
                                    <div className="wallet-history flex items-center justify-start gap-2 cursor-pointer">
                                        <InlineSVG
                                            src="/icons/swap.svg"
                                            className="h-5 w-5"
                                        />
                                        <h2>Transaction History</h2>
                                    </div>
                                </Link>
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
