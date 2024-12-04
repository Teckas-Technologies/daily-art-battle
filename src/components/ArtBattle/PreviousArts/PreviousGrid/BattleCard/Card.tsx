import React, { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { BattleData } from "@/hooks/battleHooks";
import "./Card.css";

interface CardProps {
  battle: BattleData;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ battle, onClick }) => {
  const date = new Date(battle.startTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [artOverlay, setArtOverlay] = useState(false);

  const toggleShareOverlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setArtOverlay(!artOverlay);
  };
  const shareRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
  
    if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
      setArtOverlay(false);
    }
  };
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing battle!");
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const shareOnTelegram = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing battle!");
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };
  const shareOnWhatsapp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing battle!");
    window.open(`https://wa.me/?text=${text} ${url}`, "_blank");
  };
  return (
    <div
      className="card lg:w-[23rem] lg:h-[28rem] md:w-[17rem] md:h-[25rem] w-[10rem] h-[15.5rem] gap-0 md:rounded-[1.8rem] rounded-2xl mt-0 shadow-md p-[1rem] flex flex-col items-center"
      onClick={onClick}
    >
      <div
        className="battle-img lg:w-[21rem] 
        lg:h-[21rem] md:w-[16rem] md:h-[16rem] w-[9rem] 
        h-[9rem] md:rounded-[1.8rem] rounded-2xl 
        cursor-pointer relative"
      >
        <img
          src={
            battle.grayScale
              ? battle.grayScale
              : battle.winningArt === "Art A"
              ? (battle.artAcolouredArt as string)
              : battle.artBcolouredArt
          }
          alt={battle?.specialWinner}
          className="w-full h-full object-cover 
          md:rounded-[1.8rem] rounded-2xl"
        />

        <div
          className="art-share px-3 py-[0.15rem] flex items-center gap-1 rounded-[2.5rem] absolute bottom-2 right-2 cursor-pointer"
          onClick={toggleShareOverlay}
        >
          <h4 className="text-xs cursor-pointer font-semibold">Share</h4>
          <InlineSVG
            src="/icons/share-icon.svg"
            color="#000000"
            className="fill-current w-3 h-3 spartan-medium cursor-pointer"
          />
        </div>

        {artOverlay && (
          <div className="share-overlay flex flex-row items-center justify-center gap-4 absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2">
            <InlineSVG
              src="/icons/facebook-icon.svg"
              className="bg-white rounded-full p-2 w-10 h-10 cursor-pointer pointer-events-auto"
              onClick={shareOnFacebook}
            />
            <InlineSVG
              src="/icons/tele-icon.svg"
              className="bg-white rounded-full p-2 w-10 h-10 cursor-pointer pointer-events-auto"
              onClick={shareOnTelegram}
            />
            <InlineSVG
              src="/icons/black-twitter.svg"
              className="bg-white rounded-full p-2 w-10 h-10 cursor-pointer pointer-events-auto"
              onClick={shareOnTwitter}
              style={{fill:"black"}}
            />
            <InlineSVG
              src="/icons/whatsapp.svg"
              className="bg-white rounded-full p-2 w-10 h-10 cursor-pointer pointer-events-auto"
              onClick={shareOnWhatsapp}
            />
          </div>
        )}
      </div>
      <div className="battle-info w-full h-auto flex flex-col justify-between md:px-2 px-0 lg:py-4 md:py-3 py-2">
        <div className="top date">
          <h2 className="lg:spartan-semibold md:spartan-medium md:text-md text-xs date">
            {formattedDate ? formattedDate : "Date not provided"}
          </h2>
        </div>
        <div className="bottom flex flex-col md:flex-row justify-between md:items-center gap-2 md:py-2 pt-1 pb-2">
          <div className="rare-owner lg:w-[12rem] md:w-[10rem] w-[8rem] flex items-center md:gap-2 gap-1">
            <InlineSVG
              src="/icons/trophy.svg"
              className="lg:w-6 lg:h-6 md:w-5 md:h-5 w-4 h-4"
            />
            <h2 className="lg:text-lg md:text-md text-sm md:spartan-semibold spartan-medium lg:w-[12rem] md:w-[10rem] w-[7rem] truncate overflow-hidden whitespace-nowrap">
              {battle.winningArt === "Art A"
                ? battle.artAartistName
                : battle.artBartistName}
            </h2>
          </div>
          <div className="upvotes w-auto flex items-center md:gap-2 gap-1">
            <InlineSVG
              src="/icons/green-heart.svg"
              className="lg:w-6 lg:h-6 md:w-5 md:h-5 w-4 h-4"
            />
            <div className="vote-count flex items-center gap-1">
              <h2 className="lg:text-lg md:text-md text-xs lg:spartan-bold md:spartan-semibold spartan-medium md:text-sm text-xs">
                {Number(battle.artAVotes) + Number(battle.artBVotes)}
              </h2>
              <h2 className="lg:text-lg md:text-md text-xs lg:spartan-bold md:spartan-semibold spartan-medium md:text-sm text-xs">
                Votes
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
