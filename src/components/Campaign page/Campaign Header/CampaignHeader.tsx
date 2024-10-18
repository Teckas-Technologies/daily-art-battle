"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignHeader.css";

export default function CampaignHeader() {
  const fullLink = "http://localhost:3000/campaign/createcampaign";
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="campaign-header-container">
      <div className="campaign-header-card">
        <div className="campaign-details">
          <h1>IT Company Campaign</h1>
          <div className="row">
            <span className="flex items-center">
              {" "}
              <InlineSVG src="/icons/white-calender.svg" />
              Start Date
            </span>
            <span className="span-text">12 Oct 2024</span>
          </div>
          <InlineSVG src="/icons/vertical-line.svg" />
          <div className="row">
            <span className="flex items-center">
              <InlineSVG src="/icons/white-calender.svg" />
              End Date
            </span>
            <span className="span-text">18 Oct 2024</span>
          </div>
          <InlineSVG src="/icons/vertical-line.svg" />
          <div className="row">
            <span className="flex items-center">
              <InlineSVG src="/icons/person.svg" />
              Participants
            </span>
            <span className="span-text">24 Artists</span>
          </div>
          <InlineSVG src="/icons/vertical-line.svg" />
          <div className="row">
            <span className="flex items-center">
              <InlineSVG src="/icons/person.svg" />
              Rewards
            </span>
            <span className="span-text flex items-center gap-2">
              <InlineSVG src="/icons/coin.svg" />
              2000 GFX
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between ">
          <div className="linkSection">
            <div className="campaign-header-input">
              <p>
                {" "}
                {fullLink.length > 25
                  ? `${fullLink.slice(0, 25)}.................`
                  : fullLink}
              </p>

              <button
                className="copyButton flex items-center justify-between"
                onClick={handleCopyLink}
              >
                <InlineSVG src="/icons/copy.svg" />
                Copy Link
              </button>
            </div>
            <div className="icons flex items-center gap-3">
              <span className="share-span">Share</span>
              <InlineSVG src="/icons/whatsapp.svg" />
              <InlineSVG src="/icons/facebook-icon.svg" />
              <InlineSVG src="/icons/tele-icon.svg" />
              <InlineSVG src="/icons/insta-icon.svg" />
              <InlineSVG src="/icons/twitter-icon.svg" />
            </div>
          </div>

          <div className="campaign-status flex items-center gap-2">
            <span>Campaign:</span>
            <div className="publicStatus">Public</div>
          </div>
        </div>
      </div>
    </div>
  );
}
