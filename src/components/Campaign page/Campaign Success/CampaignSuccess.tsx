"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import "./CampaignSuccess.css";
import InlineSVG from "react-inlinesvg";
import { BASE_URL } from "@/config/constants";
const CampaignSuccess = () => {
  const searchParams = useSearchParams();
  const queryParams = searchParams ? searchParams.get("campaignUrl") : null;
  const fullLink = queryParams
    ? `${BASE_URL}/${queryParams}`
    : "";
  const [buttonText, setButtonText] = useState("Copy link");
  const handleCopyLink = () => {
    if (fullLink) {
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
    } else {
      console.error("No link available to copy.");
    }
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
            {fullLink ? (
              <>
                <p>
                  {fullLink.length > 20
                    ? `${fullLink.slice(0, 20)}.....`
                    : fullLink}
                </p>
                <button
                  className="copy-link-btn flex items-center"
                  onClick={handleCopyLink}
                >
                  <InlineSVG src="/icons/copy.svg" className="copy-icon" />
                  {buttonText}
                </button>
              </>
            ) : (
              <p>No campaign URL available.</p>
            )}
          </div>

          <div className="success-share-section">
            <span>Share</span>
            <div className="success-social-icons">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(fullLink)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InlineSVG className="social-icon" src="/icons/whatsapp.svg" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  fullLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InlineSVG
                  className="social-icon"
                  src="/icons/facebook-icon.svg"
                />
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  fullLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InlineSVG className="social-icon" src="/icons/tele-icon.svg" />
              </a>
              {/* <a
                href={`https://www.instagram.com/?url=${encodeURIComponent(
                  fullLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InlineSVG
                  className="social-icon"
                  src="/icons/insta-icon.svg"
                />
              </a> */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  fullLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InlineSVG
                  className="social-icon"
                  src="/icons/twitter-icon.svg"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSuccess;
