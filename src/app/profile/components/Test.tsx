"use client";
import { useState } from "react";
import NftGrid from "./Nfts";
import ArtGrid from "./ArtGrid";
import Profile from "@/app/profile/components/ProfileCreation";

const Profile2 = () => {
  const [profile, setProfile] = useState(false);
  const [showArt, setArt] = useState(true);
  const [showNft, setNft] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleProfile = () => {
    setProfile(true);
  };

  const handleProfileClose = () => {
    setProfile(false);
  };

  const handleNft = () => {
    setArt(false);
    setNft(true);
  };

  const handleArt = () => {
    setArt(true);
    setNft(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <section className="relative flex flex-col min-h-screen">
      {/* Toggle Button for Mobile */}
      <button
        className="fixed top-4  mt-20 left-4 z-30 md:hidden p-2 bg-indigo-600 text-white rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0  mt-20 left-0 w-64 h-full bg-white  shadow-lg z-20 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-1/4`}
      >
        <div className="flex items-center p-4">
          <img
            style={{ aspectRatio: "1/1" }}
            src="https://media.licdn.com/dms/image/D5603AQFGUcAc9N54-g/profile-displayphoto-shrink_400_400/0/1678004414342?e=2147483647&v=beta&t=X5BGH2s3DHxXeDoAy3-Wnn8jkJOnh4AVzLuig4HQoMA"
            alt="user-avatar-image"
            className="h-12 w-12 md:h-24 md:w-24 border-4 border-solid border-white rounded-full"
          />
          <div className="hidden md:flex flex-col items-center md:items-start ml-4">
            <h3 className="font-manrope text-gray-100 font-bold text-xl md:text-2xl">
              Blessy
            </h3>
            <p className="font-normal text-gray-100 text-sm md:text-base">
              blessy@123
            </p>
          </div>
          <button
                    className="rounded-full py-3.5 px-5 bg-gray-100 flex items-center group transition-all duration-500 hover:bg-indigo-100 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path className="stroke-gray-700 transition-all duration-500 group-hover:stroke-indigo-600"
                            d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                            stroke="#374151" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                    <span
                        className="px-2 font-medium text-base leading-7 text-gray-700 transition-all duration-500 group-hover:text-indigo-600">Software
                        Engineer</span>
                </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <button
            onClick={handleProfile}
            className="py-2 px-4 rounded-full bg-indigo-600 text-white font-semibold text-sm md:text-base leading-7 shadow-sm transition-all duration-500 hover:bg-indigo-700 w-full text-center"
          >
            Edit Profile
          </button>
          <button className="py-2 px-4 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm md:text-base leading-7 shadow-sm transition-all duration-500 hover:bg-indigo-100 w-full text-center">
            Settings
          </button>
          <button
            onClick={handleArt}
            className={`py-2 px-4 rounded-full ${
              showArt
                ? "bg-orange-100 text-orange-600"
                : "bg-orange-50 text-gray-700"
            } font-semibold text-sm md:text-base leading-7 shadow-sm transition-all duration-500 hover:bg-orange-100 w-full text-center`}
          >
            Uploaded Arts
          </button>
          <button
            onClick={handleNft}
            className={`py-2 px-4 rounded-full ${
              showNft
                ? "bg-orange-100 text-orange-600"
                : "bg-orange-50 text-gray-700"
            } font-semibold text-sm md:text-base leading-7 shadow-sm transition-all duration-500 hover:bg-orange-100 w-full text-center`}
          >
            NFT Collection
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 ml-0 md:ml-64 overflow-y-auto">
        {profile && <Profile onClose={handleProfileClose} />}
        {showNft && (
          <>
            <ul className="mb-4 flex justify-center flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="me-2">
                <a
                  href="#"
                  aria-current="page"
                  className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg"
                >
                  Unique Rare NFTs
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50"
                >
                  Spinners NFTs
                </a>
              </li>
            </ul>
            <NftGrid />
          </>
        )}
        {showArt &&
          <div className="mt-4 ml-20">
            <ArtGrid />
          </div>}
      </div>
    </section>
  );
};

export default Profile2;
