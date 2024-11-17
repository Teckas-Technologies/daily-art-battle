"use client";
import React, { useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import "./DailyCheckin.css";
import useDailyCheckin from "@/hooks/dailyCheckinHook";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "@/components/Toast";
const DailyCheckin = () => {
  const [streak, setStreak] = useState(Array(7).fill(false));
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [toast, setToast] = useState(false); 
  const [toastMessage, setToastMessage] = useState(""); 
  const [successToast, setSuccessToast] = useState(""); 
  const {
    dailyCheckin,
    weeklyCheckin,
    fetchDailyCheckin,
    loading,
    error,
    checkinData,
    streakDays,
    claimDate,
  } = useDailyCheckin();
  const { user } = useAuth();
  let userDetails = user;
  const toggleDay = async (index: number) => {
    if (isClaimed || isClaimedForToday()) return;

    setStreak((prev) =>
      prev.map((claimed, i) => (i === index ? !claimed : claimed))
    );
    setCurrentIndex(index);

    const result = await dailyCheckin();
    console.log(">>>>>", result);

    if (result) {
      console.log("Check-in successful:", result);
      setIsClaimed(true);
      setToastMessage(`Claimed reward for Day ${index + 1}!`);
      setSuccessToast("yes");
      setToast(true);
    }
  };

  useEffect(() => {
    const fetchStreakData = async () => {
      const data = await fetchDailyCheckin();
      console.log("data .......", data);

      if (data) {
        const streakDays = data.data.streakDays || 0;
        console.log("days", streakDays);

        const updatedStreak = Array(7).fill(false);

        for (let i = 0; i < streakDays; i++) {
          updatedStreak[i] = true;
        }

        setStreak(updatedStreak);
        if (streakDays === 7) {
          setCurrentIndex(6);
        } else {
          setCurrentIndex(streakDays - 1);
        }
      }
    };

    fetchStreakData();
  }, [userDetails, streakDays, claimDate]);
  const isClaimedForToday = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const claimDateString = claimDate?.split("T")[0];
    console.log("claim Date", claimDateString);

    return currentDate === claimDateString;
  };
  const handleWeeklyClaim = async () => {
    if (streakDays === 7 && !isClaimed) {
      const result = await weeklyCheckin();
      console.log("Weekly Check-in Result:", result);
      if (result) {
        setIsClaimed(true);
        setToast(true);
        setToastMessage("Claimed 7-day streak reward!");
        setSuccessToast("yes");
      }
    }
  };
  return (
    <div
      className="flex w-full flex-col justify-center items-center text-white p-6 rounded-xl gap-[30px] mt-[20px] mb-[20px] md:flex-row lg:gap-[50px] lg:px-8 lg:py-10 xl:gap-9 xl:px-8 xl:py-10 xxl:gap-9 xxl:px-8 xxl:py-10"
      style={{ border: "1px solid #383838" }}
    >
      <div className="flex items-center justify-between flex-col gap-[80px] lg:items-end md:items-end xl:items-end xxl:items-end">
        <div
          className="flex rounded-full justify-center bg-transparent gap-2 py-3 px-4 items-center"
          style={{ border: "0.75px solid #00FF00" }}
        >
          <img
            src="/images/logo.png"
            alt="GFXvs Icon"
            className="w-[30px] h-[30px] lg:w-[30px] lg:h-[30px] xl:w-[30px] xl:h-[30px] xxl:w-[45px] xxl:h-[45px]"
          />
          <span className="font-medium text-xs md:text-xs lg:text-xs xl:font-sm xxl:text-lg">
            Current Streak
          </span>
          <p className="font-semibold text-xl lg:text-xl xl:text-xl md:text-xl xxl:text-2xl">
          {streak.filter((day) => day).length} Days
          </p>
        </div>

        {/* <div className="flex text-white lg:justify-center items-center">
          <div className="flex lg: justify-center items-center text-white">
            <div className="flex lg: justify-center items-center text-white"> */}
        <div className="relative flex flex-row items-center justify-center gap-[3px] md:gap-[50px] lg:gap-[20px] xl:gap-[50px] xxl:gap-[65px]">
          <div className="absolute lg: top-2 left-0 right-0 h-0.5 bg-[#00FF00] z-0"></div>

          {streak.map((claimed, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center z-10"
            >
              <div
                className={`flex rounded-full items-center justify-center border-2 w-4 h-4 lg:w-5 lg:h-5 md:w-5 md:h-5 xl:w-5 xl:h-5 xxl:h-5 xxl:w-5 ${
                  claimed
                    ? "bg-[#000000] text-black"
                    : "bg-[#000000] text-green-500"
                } cursor-pointer`}
                style={{
                  borderColor: "#00FF00",
                  cursor: isClaimedForToday() ? "not-allowed" : "pointer",
                }}
                onClick={() => toggleDay(index)}
              >
                {claimed && (
                  <InlineSVG
                    src="/icons/tick-green.svg"
                    className="w-2 h-2 lg:w-3 h-3 md:w-3 h-3 xl:w-3 h-3 xxl:w-3 h-3"
                  />
                )}
                {currentIndex === index && claimed && (
                  <img
                    src="/images/logo.png"
                    className="absolute w-[30px] h-[30px] top-[-40px] lg:w-[50px] lg:h-[50px] xl:w-[50px] xl:h-[50px] xxl:w-[60px] xxl:h-[60px] xxl:top-[-75px] md:top-[-70px]"
                  />
                )}
              </div>
              <div
                className={`flex mt-2 px-[10px] py-[px] items-center justify-center rounded-sm text-[10px] md:hidden md:px-4 md:py-[3px] ${
                  claimed ? "bg-[#00FF00] text-black" : "bg-gray-400 text-white"
                }`}
                onClick={() => toggleDay(index)}
              >
                <span className="flex text-[#ffffff] flex-row items-center gap-[2px] lg:text-xs md:text-xs xl:text-sm xxl:text-lg">
                  <InlineSVG
                    src="/icons/coin.svg"
                    className="w-4 h-4 md:w-4 h-4 lg:w-4 h-4 xl:w-5 h-5 xxl:w-6 h-6"
                  />{" "}
                  1
                </span>
              </div>
              <span className="hidden md:flex lg:mt-2 text-[#ffffff] flex-row items-center gap-1 text-xs xl:text-sm xxl:text-lg">
                <InlineSVG
                  src="/icons/coin.svg"
                  className="2-4 h-4 md:w-4 h-4 lg:w-4 h-4 xl:w-5 h-5 xxl:w-6 h-6"
                />{" "}
                1
              </span>
              <button
                className={`hidden mt-2 px-6 py-[5px] rounded-md text-[10px] md:px-4 md:py-[3px] md:flex ${
                  claimed ? "bg-[#00FF00] text-black" : "bg-gray-400 text-white"
                }`}
                onClick={() => toggleDay(index)}
                disabled={isClaimedForToday()}
              >
                Claim
              </button>
            </div>
          ))}
        </div>
        {/* </div>
          </div>
        </div> */}
      </div>

      <div className="streak-box">
        <div className="flex rounded-2xl flex-col w-[180px] h-[200px] items-center justify-center text-center bg-[#171717] p-4 gap-5 md:gap-5 md:w-[220px] md:h-[230px] lg:gap-6 lg:w-[190px] lg:h-[210px] xl:gap-6 xl:w-[190px] xl:h-[210px] xxl:gap-6 xxl:w-[220px] xxl:h-[250px]">
          <div className="flex lg: flex-row items-center justify-center gap-1">
            <img
              src="/icons/coin.svg"
              alt="Coin Icon"
              className="w-[60px] h-[60px] md:w-[30px] md:h-[30px] lg:w-[50px] lg:h-[50px] xl:w-[55px] xl:h-[55px] xxl:w-[65px] xxl:h-[65px]"
            />
            <p className="text-[#ffffff] text-4xl md:text-4xl lg:text-4xl xl:text-5xl xxl:text-5xl">
              25
            </p>
          </div>
          <div>
            <span className="text-[#D3D3D3] text-sm md:text-sm lg:mt-4 text-sm xl:text-sm">
              7 Day Voting Streak
            </span>
            <button
              className={`text-[#ffffff] w-[100%] rounded-full mt-3 text-sm py-2 px-10 lg:px-10 lg:py-2  xl:px-10 xl:py-2  xxl:px-10 xxl:py-3 ${
                streakDays === 7 && !isClaimed ? "bg-[#00FF00]" : "bg-[#AAAAAA]"
              }`}
              onClick={handleWeeklyClaim}
            >
              {streakDays === 7 && isClaimed ? "Claimed" : "Claim"}
            </button>
          </div>
        </div>
      </div>
      {toast && toastMessage && <div className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden" style={{ zIndex: 55 }}>
        <div className="relative w-full h-full">
          <Toast
            success={successToast === "yes" ? true : false}
            message={toastMessage}
            onClose={() => { setToast(false); setToastMessage(""); setSuccessToast(""); }}
          />
        </div>
      </div>
      }
    </div>
  );
};

export default DailyCheckin;