'use client';
import React from "react";
import "./CampaignSuccess.css";
import InlineSVG from "react-inlinesvg";
const CampaignSuccess = () => {
  const fullLink = "http://localhost:3000/campaign/createcampaign";
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="campaign-success-container">
      <div className="campaign-header">
        <div className="campaign-content">
          <h1 className="campaign-title">Create Campaign</h1>
          <p className="campaign-description md:w-[400px]">
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
              {fullLink.length > 15 ? `${fullLink.slice(0, 15)}...` : fullLink}
            </p>
            <button className="copy-link-btn flex items-center gap-1"  onClick={handleCopyLink}>
              <InlineSVG src="/icons/copy.svg" /> Copy link
            </button>
          </div>

          <div className="share-section">
            <span>Share</span>
            <div className="social-icons">
              <InlineSVG src="/icons/whatsapp.svg" />
              <InlineSVG src="/icons/facebook-icon.svg" />
              <InlineSVG src="/icons/tele-icon.svg" />
              <InlineSVG src="/icons/insta-icon.svg" />
              <InlineSVG src="/icons/twitter-icon.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSuccess;
