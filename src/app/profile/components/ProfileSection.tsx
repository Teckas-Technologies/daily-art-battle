"use client";
import Profile from "@/app/profile/components/ProfileCreation";
import { useState } from "react";
import NftGrid from "./Nfts";
import ArtGrid from "./ArtGrid";
import Coin from "@/app/profile/components/Coin";
import { graphQLService } from "@/data/graphqlService";
import { FETCH_FEED } from "@/data/queries/feed.graphql"; 
import { ACCOUNT_DATE } from "@/data/queries/accountDate.graphql";

const Prof = () => {
  const [profile, setProfile] = useState(false);
  const [showart, setArt] = useState(true);
  const [shownft, setNft] = useState(false);
  const [coin, setPage] = useState(false);
  const [nftOption, setNftOption] = useState("unique"); // State to track NFT options
  const [showModal, setShowModal] = useState(true);

  const handleProfile = () => setProfile(true);
  const handleProfileClose = () => setProfile(false);
  const handleCoinBuy = () => setPage(true);
  const handleCloseCoinBuy = () => setPage(false);
  const handleNft = () => {
    setArt(false);
    setNft(true);
    setNftOption("unique"); // Reset NFT option on open
  };
  const handleArt = () => {
    setArt(true);
    setNft(false);
  };

  const handleNftOption = async(option: any) => {
    setNftOption(option); // Set selected NFT option
    const posts = await graphQLService({
      query: FETCH_FEED,
      variables: { nft_contract_id:"artbattle.mintspace2.testnet" ,owner:"scalability-vega.testnet",offset:200,limit:10},
      network: "testnet"
    });
    console.log(posts);

    const date = await graphQLService({
      query: ACCOUNT_DATE,
      variables: { account_id:"sathishm.testnet"},
      network: "testnet"
    });
    console.log(date);
  };

  const handleRegister = () => {
    setShowModal(false);
    // Redirect to registration page or perform registration action
  };

  const dismissModal = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-[50px] min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans relative z-10">
   <div className="absolute inset-0 z-0">
    <div className="slider__shapes relative w-full h-full">
      <img src="/images/slider_shape01.png" alt="shape" className="absolute left-[23%] top-[17%]"/>
      <img src="/images/slider_shape02.png" alt="shape" className="absolute left-[40%] top-[30%]"/>
      <img src="/images/slider_shape03.png" alt="shape" className="absolute left-[60%] top-[45%]"/>
      <img src="/images/slider_shape04.png" alt="shape" className="absolute left-[75%] top-[60%]"/>
    </div>
  </div>
      {/* Header Section */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50 modal">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Register Required</h3>
            <p className="mb-6">You need to register before interacting with the content.</p>
            <div className="flex justify-center">
              <button
                onClick={handleRegister}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-110"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="w-full py-8 px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <img
            src="https://media.licdn.com/dms/image/D5603AQFGUcAc9N54-g/profile-displayphoto-shrink_400_400/0/1678004414342?e=2147483647&v=beta&t=X5BGH2s3DHxXeDoAy3-Wnn8jkJOnh4AVzLuig4HQoMA"
            alt="user-avatar-image"
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-green-500 rounded-full shadow-xl"
          />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Blessy</h2>
            <p className="text-md sm:text-lg text-gray-400">blessy@123</p>
          </div>
        </div>
        <div className="flex space-x-3 sm:space-x-5 mt-4 sm:mt-0">
          <button
            onClick={handleCoinBuy}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Buy Coins
          </button>
          <div className="bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center transition-transform transform hover:scale-105">
            <span>Total Coins:</span>
            <span className="ml-2 font-bold">$3242</span>
          </div>
        </div>
      </header>

      {/* Navigation Section */}
      <nav className="flex flex-wrap justify-center py-4 sm:py-6">
        <button
          onClick={handleArt}
          className={`px-6 sm:px-8 mt-2 py-2 sm:py-3 rounded-lg mx-1 sm:mx-2 transition-colors transition-transform transform hover:scale-105 ${
            showart ? "bg-green-600" : "bg-gray-700"
          } text-white`}
        >
          Uploaded Arts
        </button>
        <button
          onClick={handleNft}
          className={`px-6 sm:px-8 mt-2 py-2 sm:py-3 rounded-lg mx-1 sm:mx-2 transition-colors transition-transform transform hover:scale-105 ${
            shownft ? "bg-green-600" : "bg-gray-700"
          } text-white`}
        >
          NFT Collection
        </button>
        <button
          onClick={handleProfile}
          className="px-6 sm:px-8 mt-2 py-2 sm:py-3 rounded-lg mx-1 sm:mx-2 bg-gray-700 text-white transition-transform transform hover:scale-105"
        >
          Edit Profile
        </button>
        <button className="px-6 sm:px-8 mt-2 sm:mt-2 py-2 sm:py-3 rounded-lg mx-1 sm:mx-2 bg-gray-700 text-white transition-transform transform hover:scale-105">
          Settings
        </button>
      </nav>

      {/* Main Content Section */}
      <main className="px-5 sm:px-10 py-8 sm:py-10">
        {profile && <Profile onClose={handleProfileClose} />}
        {coin && <Coin onClose={handleCloseCoinBuy} />}
        <div className="container mx-auto">
          {shownft && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-6 sm:mb-8">
                NFT Collection
              </h3>
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => handleNftOption("unique")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 mx-2 rounded-lg transition-transform transform hover:scale-105 ${
                    nftOption === "unique" ? "bg-green-600" : "bg-gray-700"
                  } text-white`}
                >
                  Unique Rare NFTs
                </button>
                <button
                  onClick={() => handleNftOption("spinners")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 mx-2 rounded-lg transition-transform transform hover:scale-105 ${
                    nftOption === "spinners" ? "bg-green-600" : "bg-gray-700"
                  } text-white`}
                >
                  Spinners NFTs
                </button>
              </div>
              {nftOption === "unique" && <NftGrid />}
              {nftOption === "spinners" && <NftGrid />}
            </div>
          )}
          {showart && <ArtGrid />}
        </div>
      </main>
      </div>
  );
};

export default Prof;
