import React from "react";
import InlineSVG from "react-inlinesvg";
import "./ConnectWallet.css";
const ConnectWallet = () => {
  return (
    <div className="flex flex-col items-center  bg-[#000000] fixed inset-0 p-8">
      <div className="flex gap-1 items-center camapign-path md:mb-10 pt-20">
        <button className="camapign-path-button">GFXvs</button>
        <InlineSVG
          src="/icons/green-arrow.svg"
          className="fill-current text-green-500"
        />
        <h3 className="text-green-500 spartan-semibold underline cursor-pointer">
          My Profile
        </h3>
      </div>
      <div className="flex items-center justify-center gap-[80px] bg-[#000000] text-white rounded-lg border border-gray-700  w-[100%] h-[200px]">
        <div className="flex items-center gap-6">
          <img
            src="/images/profile.png"
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">Uppalapati Prabhas Raju</h2>
            <p className="text-gray-400 text-sm">prabhasraju23@gmail.com</p>
            <div className="flex gap-4 mt-2">
              <button className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700">
                Edit Profile
              </button>
              <button className="bg-gray-600 text-white px-4 py-1 rounded-full hover:bg-gray-700">
                Buy Coins
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#1A1A1A] rounded-lg p-4 border border-yellow-600 text-center">
          <div>
            <div className="flex justify-center mb-2"></div>
            <h3 className="text-xl font-semibold flex flex-row items-center justify-center gap-1">
              {" "}
              <InlineSVG src="/icons/coin.svg" className="w-[40px] h-[40px]" />
              GFXvs
            </h3>
            <p className="text-3xl font-bold">2000</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-gray-400">
            Referral Link <span className="text-yellow-500">100 GFXvs </span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              readOnly
              value="https://gfxvs/refer..."
              className="bg-transparent border border-gray-700 rounded-lg px-4 py-1 text-sm w-44"
            />
            <InlineSVG src="/icons/copy-green.svg" />

            <InlineSVG src="/icons/share.svg" />
          </div>
          <button className="flex items-center bg-green-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-green-700">  <InlineSVG src="/icons/tele-green.svg" />Connect</button>
        </div>

        <button className="flex items-center bg-red-600 text-white px-6 py-2 rounded-full ml-8 hover:bg-red-700">
          Connect Wallet
          <InlineSVG src="/icons/side-arrow.svg" />
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
