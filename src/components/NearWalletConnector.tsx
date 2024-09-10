"use client";
import { useState } from "react";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from 'next/navigation';
import Profile from "../app/profile/components/ProfileCreation";
import Coin from "../app/profile/components/Coin";

export const NearWalletConnector = () => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coin,setCoin] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);


  const handleSignout = async () => {
    if(isConnected){
    const wallet = await selector.wallet();
    return wallet.signOut();
    }
  };

  const handleGfx = ()=>{
    setCoin(true);
  }

  const handleGfxClose = ()=>{
    setCoin(false);
  }

  const handleSignIn = async () => {
    return connect();
  };

  const handleRoute = () => {
    router.push(`/theme`);
  };

  const handleProfile = ()=>{
     router.push("/profile");
  }

 
  const url = () => {
    const url = window.location.origin;
    window.location.href = url;
  };

  return (
    <>
      <nav
        className="navbar bg-gray-950"
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 0,
          padding: "10px 5vw",
        }}
      >
        <div className="flex items-center flex-col md:flex-col">
          <a onClick={url}>
            <img
              src="/images/logo.png"
              alt="GFXvs"
              width={50}
              height={50}
              className="md:mb-0"
            />
          </a>
        </div>
        <div className="flex items-center">
        {/* {isConnected ? (
  <div className="flex flex-row hover-trigger space-x-0">
    <p className="px-2 items-center text-xs sm:text-sm md:text-base">
      {activeAccountId}
    </p>
    <img
      onClick={handleSignout}
      src="/wallet lock.png"
      title="Disconnect"
      alt="Disconnect"
      className="w-10 h-10 cursor-pointer mr-3"
    />
    {activeAccountId === "scalability-vega.testnet" && (
      <label
        onClick={handleRoute}
        className="ml-2 px-2 bg-green-600 border hover:bg-green-500 rounded-lg cursor-pointer"
      >
        admin
      </label>
    )}
  </div>
) : (
  <img
    onClick={handleSignIn}
    src="/wallet open.png"
    className="w-10 h-10 cursor-pointer mr-3"
  />
)} */}
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded={dropdownOpen}
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 rounded-full" viewBox="0 0 448 512"><path fill="#ffffff" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>       </button>
        </div>
      </nav>
     
      {coin&&(
        <Coin onClose={handleGfxClose}/>
      )}
      {dropdownOpen && (
 <div
 className="fixed right-10 top-16 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
 id="user-dropdown"
 style={{ zIndex: 50, overflow: 'hidden' }}
>

          <div className="px-4 py-3 flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 rounded-full" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>            <div>
              <span className="block text-sm text-gray-900 dark:text-white">
                Blessy christopher 
              </span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                blessy143@gmail.com
              </span>
            </div>
          </div>
          <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
              {activeAccountId?(
                    <p
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    {activeAccountId}
                  </p>
              ):(
                <p
                onClick={handleSignIn}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
               Connect Wallet
              </p>
              )}
           
            </li>
            <li>
              <p
                onClick={handleProfile}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Profile
              </p>
            </li>
            <li>
              <p
               onClick={handleGfx}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
               GFX Points
              </p>
            </li>
            <li>
              <p
                onClick={handleSignout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </p>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
