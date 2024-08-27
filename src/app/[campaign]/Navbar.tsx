"use client";
import { useState } from "react";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignIn = async () => {
    return connect();
  };

  const handleRoute = () => {
    router.push(`/admin`);
  };

  
  const handleCampaign = () => {
    router.push(`/campaigns`);
  };

  const url = () => {
    const url = window.location.origin;
    window.location.href = url;
  };

  return (
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
            className="md:mb-0" // Add margin bottom for smaller screens
          />
        </a>
      </div>

      
     
      {isConnected ? (
        <div className="flex flex-row justify-center items-center hover-trigger">
           <div className="relative">
           <button
        id="dropdownNavbarLink"
        onClick={handleCampaign}
        className="px-2 items-center text-xs sm:text-sm md:text-base hover:underline"
      >
        Campaings
      </button>
      </div>
          <p className="px-2 items-center text-xs sm:text-sm md:text-base">
            {activeAccountId}
          </p>
          <img
            onClick={handleSignout}
            src="/wallet lock.png"
            title="Disconnect"
            alt="Disconnect"
            className="w-10 h-10 cursor-pointer"
          />
          {activeAccountId === "rapid_zuckerberg.testnet" && (
            <label
              onClick={handleRoute}
              className="ml-2 px-2 bg-green-600 border hover:bg-green-500 rounded-lg cursor-pointer"
            >
              admin
            </label>
          )}
        </div>
      ) : (
        <div className="flex flex-row justify-center items-center hover-trigger">
        <button
        id="dropdownNavbarLink"
        onClick={handleCampaign}
        className="px-2 items-center text-xs sm:text-sm md:text-base hover:underline"
      >
        Campaings
      </button>
        <img
          onClick={handleSignIn}
          src="/wallet open.png"
          className="w-10 h-10 cursor-pointer"
        />
        </div>
      )}
    </nav>
  );
};
