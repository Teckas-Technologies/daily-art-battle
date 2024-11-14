"use client";
import React, { useState } from "react";
import InlineSVG from "react-inlinesvg";
import "./ConnectWallet.css";
const ConnectWallet = () => {
  const [streak, setStreak] = useState(Array(7).fill(false));
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setStreak((prev) =>
      prev.map((claimed, i) => (i === index ? !claimed : claimed))
    );
    setCurrentIndex(index);
  };
  return (
    <div
      className="flex lg: justify-center items-center gap-9 px-8 py-10 text-white p-6 rounded-xl  mt-[20px]"
      style={{ border: "1px solid #383838" }}
    >
      <div className="flex lg: items-end flex-col justify-between gap-[60px]">
        <div
          className="flex lg: items-center bg-transparent py-2 px-4 rounded-full justify-center gap-2"
          style={{ border: "0.75px solid #00FF00" }}
        >
          <img
            src="/images/logo.png"
            alt="GFXvs Icon"
            className="lg: w-[25px] h-[25px]"
          />
          <span className="lg: text-xs font-semibold">Current Streak</span>
          <p className="lg: text-lg font-semibold text-sm">2 Days</p>
        </div>
        <div className="flex lg: justify-center items-center text-white">
          <div className="flex lg: justify-center items-center text-white">
            <div className="flex lg: justify-center items-center text-white">
              <div className="relative flex lg: items-center gap-[40px]">
                <div className="absolute lg: top-2 left-0 right-0 h-0.5 bg-[#00FF00] z-0"></div>

                {streak.map((claimed, index) => (
                  <div
                    key={index}
                    className="relative flex lg: flex-col items-center z-10"
                  >
                    <div
                      className={`flex lg: w-5 h-5 rounded-full items-center justify-center border-2 ${
                        claimed
                          ? "bg-[#000000] text-black"
                          : "bg-[#000000] text-green-500"
                      } cursor-pointer`}
                      style={{ borderColor: "#00FF00" }}
                      onClick={() => toggleDay(index)}
                    >
                      {claimed && <InlineSVG src="/icons/tick-green.svg" />}
                      {currentIndex === index && claimed && (
                        <img
                          src="/images/logo.png"
                          className="absolute lg: top-[-50px] w-10 h-10"
                        />
                      )}
                    </div>
                    <span className="flex lg: mt-2 text-[#ffffff] flex-row items-center gap-1 text-xs">
                      <InlineSVG src="/icons/coin.svg" className="lg: w-4 h-4" /> 1
                    </span>
                    <button
                      className={`lg: mt-2 px-5 py-[3px] rounded-md text-[10px] ${
                        claimed
                          ? "bg-[#00FF00] text-black"
                          : "bg-gray-400 text-white"
                      }`}
                      onClick={() => toggleDay(index)}
                    >
                      Claim
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="streak-box">
        <div className="flex lg: flex-col items-center justify-center gap-6 rounded-lg p-4 text-center bg-[#171717] w-[170px] h-[190px]">
          <div className="flex lg: flex-row items-center justify-center gap-1">
            <img
              src="/icons/coin.svg"
              alt="Coin Icon"
              className="lg: w-[40px] h-[40px]"
            />
            <p className="text-[#ffffff] lg: text-3xl font-bold ">25</p>
          </div>
          <div>
            <span className="text-[#D3D3D3] lg: mt-4 text-sm">
              7 Day Voting Streak
            </span>
            <button className="bg-[#AAAAAA] text-[#ffffff] lg: mt-2 px-10 py-2 rounded-full text-xs">
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
