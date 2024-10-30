"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignHeader.css";
import { useState } from "react";

export default function CampaignHeader() {
  const fullLink = "http://localhost:3000/campaign/createcampaign";
  const [buttonText, setButtonText] = useState("Copy link");
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        setButtonText("Copied");
        setTimeout(() => {
          setButtonText("Copy link");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
 
  return (
    <>
    
    <div className="campaign-header-container">
      <div className="campaign-header-card">
        <div className="campaign-details">
          <h1>IT Company Campaign</h1>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-3 md:gap-[43px] ">
          <div className="flex items-center md:items-center sm:items-start justify-center md:justify-center sm:justify-start flex-row gap-7 md:gap-[43px]">
              <div className="row sm:items-start">
                <span className="flex items-center span-date">
                  <InlineSVG src="/icons/white-calender.svg" />
                  Start Date
                </span>
                <span className="span-text sm:self-start">12 Oct 2024</span>
              </div>

              <InlineSVG src="/icons/vertical-line.svg" />
              <div className="row">
                <span className="flex items-center span-date">
                  <InlineSVG src="/icons/white-calender.svg" />
                  End Date
                </span>
                <span className="span-text sm:self-start">18 Oct 2024</span>
              </div>
              <InlineSVG src="/icons/vertical-line.svg" />
            </div>

            <div className="flex items-center md:items-center sm:items-start justify-center md:justify-center sm:justify-start flex-row gap-7 md:gap-[43px] mobile-row">
              <div className="row ">
                <span className="flex items-center span-date">
                  <InlineSVG src="/icons/person.svg" />
                  Participants
                </span>
                <span className="span-text sm:self-start ">24 Artists</span>
              </div>

              <InlineSVG src="/icons/vertical-line.svg" />
              <div className="row">
                <span className="flex items-center span-date">
                  <InlineSVG src="/icons/person.svg" />
                  Rewards
                </span>
                <span className="span-text flex items-center gap-1 sm:gap-2 sm:self-start">
                  <InlineSVG src="/icons/coin.svg" />
                  2000 GFX
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col sm:flex-row items-center md:justify-between md:mt-4"
        >
          <div className="campaign-header-input">
            <p>
              {" "}
              {fullLink.length > 15
                ? `${fullLink.slice(0, 15)}......`
                : fullLink}
            </p>

            <button
              className="copyButton flex items-center justify-between"
              onClick={handleCopyLink}
            >
              <InlineSVG src="/icons/copy.svg" className="copy-icon" />
              {buttonText}
            </button>
          </div>
          <div className="flex flex-row items-center justify-center sm:justify-between mt-4 sm:mt-0 gap-4 sm:gap-0 md:gap-[235px]">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="share-span">Share</span>
              <InlineSVG src="/icons/whatsapp.svg" className="header-social-share" />
              <InlineSVG
                src="/icons/facebook-icon.svg"
                className="header-social-share"
              />
              <InlineSVG src="/icons/tele-icon.svg" className="header-social-share" />
              <InlineSVG src="/icons/insta-icon.svg" className="header-social-share" />
              <InlineSVG
                src="/icons/twitter-icon.svg"
                className="social-share"
              />
            </div>

            <div className="campaign-status flex items-center gap-2">
              <span>Campaign:</span>
              <div className="publicStatus">Public</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
