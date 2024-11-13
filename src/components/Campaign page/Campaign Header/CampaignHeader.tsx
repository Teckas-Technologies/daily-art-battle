"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignHeader.css";
import { useState } from "react";
import { CampaignPageData } from "@/hooks/CampaignHook";
interface CampaignHeaderProps {
  campaign?: CampaignPageData | null;
  status: string;
  participantsCount: number;
}
export default function CampaignHeader({
  campaign,
  status,
  participantsCount,
}: CampaignHeaderProps) {
  const baseLink = "https://gfxvs.com/";
  const fullLink = campaign?.campaignUrl
    ? baseLink + campaign.campaignUrl.split("/").pop()
    : baseLink;
  const [buttonText, setButtonText] = useState("Copy link");
  console.log("Participants Count ", participantsCount);

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getUTCDate()).padStart(2, "0")} ${date.toLocaleString(
      "en-GB",
      { month: "short", timeZone: "UTC" }
    )} ${date.getUTCFullYear()}`;
  };

  return (
    <>
      <div className="campaign-header-container">
        <div className="campaign-header-card">
          <div className="campaign-details">
            <h1>{campaign?.campaignName}</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-3 md:gap-[43px] ">
              <div className="flex items-center md:items-center sm:items-start justify-center md:justify-center sm:justify-start flex-row gap-7 md:gap-[43px]">
                <div className="row sm:items-start">
                  <span className="flex items-center span-date">
                    <InlineSVG src="/icons/white-calender.svg" />
                    Start Date
                  </span>
                  <span className="span-text sm:self-start">
                    {campaign?.startDate
                      ? formatDate(campaign.startDate)
                      : "N/A"}
                  </span>
                </div>

                <InlineSVG src="/icons/vertical-line.svg" />
                <div className="row">
                  <span className="flex items-center span-date">
                    <InlineSVG src="/icons/white-calender.svg" />
                    End Date
                  </span>
                  <span className="span-text sm:self-start">
                    {campaign?.endDate ? formatDate(campaign.endDate) : "N/A"}
                  </span>
                </div>
                <InlineSVG src="/icons/vertical-line.svg" />
              </div>

              <div className="flex items-center md:items-center sm:items-start justify-center md:justify-center sm:justify-start flex-row gap-7 md:gap-[43px] mobile-row">
                <div className="row ">
                  <span className="flex items-center span-date">
                    <InlineSVG src="/icons/person.svg" />
                    Participants
                  </span>
                  <span className="span-text sm:self-start ">
                    {participantsCount} Artists
                  </span>
                </div>

                <InlineSVG src="/icons/vertical-line.svg" />
                <div className="row">
                  <span className="flex items-center span-date">
                    <InlineSVG src="/icons/person.svg" />
                    Rewards
                  </span>
                  <span className="span-text flex items-center gap-1 sm:gap-2 sm:self-start">
                    <InlineSVG src="/icons/coin.svg" />
                    {campaign?.totalRewards} GFX
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center md:justify-between md:mt-4">
            <div className="campaign-header-input">
              <p>
                {" "}
                {fullLink.length > 25
                  ? `${fullLink.slice(0, 25)}......`
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
            <div className="flex flex-row items-center justify-center sm:justify-between mt-4 sm:mt-0 gap-4 sm:gap-0 md:gap-[250px]">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="share-span">Share</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(fullLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InlineSVG
                    src="/icons/whatsapp.svg"
                    className="header-social-share"
                  />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    fullLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InlineSVG
                    src="/icons/facebook-icon.svg"
                    className="header-social-share"
                  />
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    fullLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InlineSVG
                    src="/icons/tele-icon.svg"
                    className="header-social-share"
                  />
                </a>
                <a
                  href={`https://www.instagram.com/?url=${encodeURIComponent(
                    fullLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InlineSVG
                    src="/icons/insta-icon.svg"
                    className="header-social-share"
                  />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    fullLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InlineSVG
                    src="/icons/twitter-icon.svg"
                    className="header-social-share"
                  />
                </a>
              </div>

              <div className="campaign-status flex items-center gap-2">
                <span>Campaign:</span>
                <div className="publicStatus">
                  {campaign?.publiclyVisible ? "Public" : "Private"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
