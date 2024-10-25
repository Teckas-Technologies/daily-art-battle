"use client";
import React, { useState } from "react";
import "./CampaignSuccess.css";
import InlineSVG from "react-inlinesvg";
const CampaignSuccess = () => {
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
  const handleNavigation = () => {
    window.location.href = "/campaign";
  };
  return (
    <div className="campaign-success-container">
      <div
        className="flex gap-2 items-center camapign-path md:mb-9"
        style={{ paddingTop: "80px" }}
      >
        <button className="camapign-path-button">GFXvs</button>
        <InlineSVG src="/icons/green-arrow.svg" style={{ fill: "#00ff00" }} />
        <h3
          style={{
            color: "#FFFFFF",
         
            cursor: "pointer",
          }}
          onClick={handleNavigation}
        >
          Campaigns
        </h3>
        <InlineSVG src="/icons/green-arrow.svg" style={{ fill: "#00ff00" }} />
        <h3
          style={{
            color: "#00ff00",
            textDecoration: "underline",
          }}
        >
          Create Campaign
        </h3>
      </div>
      <div className="success-campaign-header">
        <div className="success-campaign-content">
          <h1>Create Campaign</h1>
          <p className=" md:w-[460px]">
            Create campaigns publicly or among your friends, participate in the
            campaigns and win exclusive rewards
          </p>
        </div>
      </div>
      <h2 className="campaign-success-title">Campaign Created Successfully</h2>

      <div className="flex flex-col items-center justify-center">
        <div className="campaign-link-box">
          <div className="campaign-link-inputbox">
            <p>
              {fullLink.length > 15
                ? `${fullLink.slice(0, 15)}.............`
                : fullLink}
            </p>
            <button
              className="copy-link-btn flex items-center"
              onClick={handleCopyLink}
            >
              <InlineSVG src="/icons/copy.svg" className="copy-icon" />
              {buttonText}
            </button>
          </div>

          <div className="share-section">
            <span>Share</span>
            <div className="social-icons">
              <InlineSVG className="social-icon" src="/icons/whatsapp.svg" />
              <InlineSVG
                className="social-icon"
                src="/icons/facebook-icon.svg"
              />
              <InlineSVG className="social-icon" src="/icons/tele-icon.svg" />
              <InlineSVG className="social-icon" src="/icons/insta-icon.svg" />
              <InlineSVG
                className="social-icon"
                src="/icons/twitter-icon.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSuccess;
