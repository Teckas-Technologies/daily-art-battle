"use client";
import React, { useState, useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import "./CreateCampaign.css";
import InlineSVG from "react-inlinesvg";
import CampaignSuccess from "../Campaign Success/CampaignSuccess";
const CreateCampaign = () => {
  const [segments, setSegments] = useState<string[]>([]);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [isCampaignCreated, setIsCampaignCreated] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname; 
      const urlParts = currentPath.split("/").slice(1); 

     
      if (urlParts.length >= 2) {
        setSegments(urlParts.slice(1)); 
      }
    }
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
 

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    setIsCampaignCreated(true);
  };
  const openDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.showPicker();
  };
  return (
  <>
  {!isCampaignCreated ? (
    <div className="create-campaign">
      <div className="flex gap-2 items-center" style={{ paddingTop: "80px" }}>
        <button
          style={{
            height: "30.75px",
            padding: "7.5px 18px",
            borderRadius: "35.25px",
            border: "0.75px solid #00ff00",
            background:
              "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.15) 100%)",
            textAlign: "center",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          GFXvs
        </button>
        <InlineSVG src="/icons/green-arrow.svg" style={{ fill: "#00ff00" }} />
        <h3
          style={{
            color: "#00ff00",
            textDecoration: "underline",
          }}
        >
        {capitalizeFirstLetter(segments[0])}
        </h3>
        <InlineSVG src="/icons/green-arrow.svg" style={{ fill: "#00ff00" }} />
        <h3
          style={{
            color: "#00ff00",
            textDecoration: "underline",
          }}
        >
        {capitalizeFirstLetter(segments[1])}
        </h3>
      </div>
      <div className="campaign-header">
        <div className="campaign-content">
          <h1 className="campaign-title">Create Campaign</h1>
          <p className="campaign-description md:w-[400px]">
            Create campaigns publicly or among your friends, participate in the
            campaigns and win exclusive rewards
          </p>
        </div>
      </div>
      <div
        className="flex justify-between items-center"
        style={{ marginTop: "40px", marginBottom: "15px" }}
      >
        <h1 className="create-campaign-title">Create Campaign</h1>

        <button className="create-campaign-coinsButton flex items-center gap-2">
          <InlineSVG src="/icons/coin.svg" />
          Coins to Create
        </button>
      </div>
   
      <form className="create-campaign-form"  onSubmit={handleCreateCampaign}>
        <div className="create-campaign-firstrow">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Welcome message for participants"
          />
        </div>
        <div
          className="flex justify-between items-start mt-8 "
          style={{ gap: "60px" }}
        >
          <div className="create-campaign-left">
            <div className="create-campaign-input">
              <label htmlFor="campaignName">Campaign Name</label>
              <input type="text" id="campaignName" />
              <div className="relative">
                <InlineSVG
                  src="/icons/speaker.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="create-campaign-input">
              <label htmlFor="startDate" className="flex items-center gap-2">
                Start Date
                <InlineSVG src="/icons/required-icon.svg" />
              </label>
              <input type="date" id="startDate" className="custom-date-input" ref={startDateRef}
              onFocus={() => openDatePicker(startDateRef)}/>
              <div className="relative">
                <InlineSVG
                  src="/icons/calender.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="create-campaign-input">
              <label htmlFor="endDate" className="flex items-center gap-2">
                End Date
                <InlineSVG src="/icons/required-icon.svg" />
              </label>
              <input type="date" id="endDate" className="custom-date-input"    ref={endDateRef}
              onFocus={() => openDatePicker(endDateRef)}/>
              <div className="relative">
                <InlineSVG
                  src="/icons/calender.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="create-campaign-input">
              <label htmlFor="noOfWinners" style={{ color: "#5F5F5F" }}>
                No of Winners
              </label>
              <input type="text" id="noOfWinners" />
              <div className="relative">
                <InlineSVG
                  src="/icons/green-trophy.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
          </div>

          <div className="create-campaign-right">
            <div className="create-campaign-input">
              <label htmlFor="campaignUrl" style={{ color: "#5F5F5F" }}>
                Campaign URL
              </label>
              <input type="text" id="campaignUrl" />
            </div>
            <div className="create-campaign-input">
              <label
                htmlFor="specialRewards"
                className="flex items-center gap-2"
              >
                Special Rewards
                <InlineSVG src="/icons/required-icon.svg" />
              </label>
              <input type="text" id="specialRewards" />
              <div className="relative">
                <InlineSVG
                  src="/icons/dollar.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="create-campaign-toggle">
              <label htmlFor="publiclyVisible" className="create-campaign-toggle-label">Publicly Visible</label>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="submitButton">
          Create Campaign
        </button>
      </form>
           
      
    </div>
    ) : (
      <CampaignSuccess /> 
    )}
  </>
  );
};

export default CreateCampaign;
