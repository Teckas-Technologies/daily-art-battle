// Card.tsx
import React from "react";
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

  return (
    <div
      className="card lg:w-[23rem] lg:h-[28rem] md:w-[17rem] md:h-[25rem] w-[10rem] h-[15.5rem] gap-0 md:rounded-[1.8rem] rounded-2xl mt-0 shadow-md p-[1rem] flex flex-col items-center"
      onClick={onClick}
    >
      <div className="battle-img lg:w-[21rem] lg:h-[21rem] md:w-[16rem] md:h-[16rem] w-[9rem] h-[9rem] md:rounded-[1.8rem] rounded-2xl cursor-pointer">
        <img
          src={
            battle.grayScale
              ? battle.grayScale
              : battle.winningArt == "Art A"
              ? (battle.artAcolouredArt as string)
              : battle.artBcolouredArt
          }
          alt={battle?.specialWinner}
          className="w-full h-full object-cover md:rounded-[1.8rem] rounded-2xl"
        />
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
            <h2 className="lg:text-lg md:text-md text-sm md:spartan-semibold spartan-medium lg:w-[12rem] md:w-[10rem] w-[7rem] truncate overflow-hidden whitespace-nowraps">
              {battle.winningArt === "Art A"
                ? battle.artAartistId
                : battle.artBartistId}
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
