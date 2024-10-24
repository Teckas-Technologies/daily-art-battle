"use client";
import React, { useState, useEffect, useRef } from "react";
import "./CreateCampaign.css";
import InlineSVG from "react-inlinesvg";
import CampaignSuccess from "../Campaign Success/CampaignSuccess";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface CampaignCreationProps {
  toggleCampaignModal: () => void;
}
const CreateCampaign: React.FC<CampaignCreationProps> = ({ toggleCampaignModal }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [isCampaignCreated, setIsCampaignCreated] = useState(false);

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsCampaignCreated(true);
  };

  const handleNavigation = () => {
    window.location.href = "/campaign";
  };
  const handleDateChange = (
    date: Date | null,
    setter: React.Dispatch<React.SetStateAction<Date | null>>
  ) => {
    setter(date);
    if (setter === setStartDate) setStartDatePickerOpen(false);
    else setEndDatePickerOpen(false);
  };
  return (
    <>
      {!isCampaignCreated ? (
        <div className="create-campaign">
          <div
            className="flex gap-2 items-center camapign-path"
            style={{ paddingTop: "80px" }}
          >
            <button className="camapign-path-button">GFXvs</button>
            <InlineSVG
              src="/icons/green-arrow.svg"
              style={{ fill: "#00ff00" }}
            />
            <h3
              style={{
                color: "#00ff00",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={handleNavigation}
            >
              Campaigns
            </h3>
            <InlineSVG
              src="/icons/green-arrow.svg"
              style={{ fill: "#00ff00" }}
            />
            <h3
              style={{
                color: "#00ff00",
                textDecoration: "underline",
              }}
            >
              Create Campaign
            </h3>
          </div>
          <div className="create-campaign-header">
            <div className="create-campaign-content">
              <h1>Create Campaign</h1>
              <p className=" md:w-[480px]">
                Create campaigns publicly or among your friends, participate in
                the campaigns and win exclusive rewards
              </p>
            </div>
          </div>
          <div
            className="flex justify-between items-center"
            style={{ marginTop: "40px", marginBottom: "15px" }}
          >
            <h1 className="create-campaign-title">Create Campaign</h1>

            <button className="create-campaign-coinsButton flex items-center gap-2">
              <InlineSVG src="/icons/coin.svg" className="coin-btn-icon" />
              Coins to Create
            </button>
          </div>

          <form
            className="create-campaign-form"
            onSubmit={handleCreateCampaign}
          >
            <div className="create-campaign-firstrow">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Welcome message for participants"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start mt-8 gap-0 md:gap-[60px]">
              <div className="create-campaign-left w-full md:w-1/2">
                <div className="create-campaign-input">
                  <label htmlFor="campaignName">Campaign Name</label>
                  <input type="text" id="campaignName" />
                  <div className="relative">
                    <InlineSVG
                      src="/icons/speaker.svg"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
                    />
                  </div>
                </div>

                <div className="create-campaign-input">
                  <label
                    htmlFor="startDate"
                    className="flex items-center gap-2"
                  >
                    Start Date
                    <InlineSVG src="/icons/required-icon.svg" />
                  </label>
                  <input
                    type="text"
                    id="startDate"
                    className="custom-date-input"
                    value={startDate ? startDate.toLocaleDateString() : ""}
                    readOnly
                    onClick={() => setStartDatePickerOpen(true)}
                  />
                  <div className="relative">
                    <InlineSVG
                      src="/icons/calender.svg"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
                      onClick={() => setStartDatePickerOpen(true)}
                    />
                    {isStartDatePickerOpen && (
                      <div className="datepicker-container">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) =>
                            handleDateChange(date, setStartDate)
                          }
                          onClickOutside={() => setStartDatePickerOpen(false)}
                          inline
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="create-campaign-input">
                  <label htmlFor="endDate" className="flex items-center gap-2 ">
                    End Date
                    <InlineSVG src="/icons/required-icon.svg" />
                  </label>
                  <input
                    type="text"
                    id="endDate"
                    className="custom-date-input"
                    value={endDate ? endDate.toLocaleDateString() : ""}
                    readOnly
                    onClick={() => setEndDatePickerOpen(true)}
                  />
                  <div className="relative">
                    <InlineSVG
                      src="/icons/calender.svg"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
                      onClick={() => setEndDatePickerOpen(true)}
                    />
                    {isEndDatePickerOpen && (
                      <div className="datepicker-container">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) =>
                            handleDateChange(date, setEndDate)
                          }
                          onClickOutside={() => setEndDatePickerOpen(false)}
                          inline
                        />
                      </div>
                    )}
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
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
                    />
                  </div>
                </div>
              </div>

              <div className="create-campaign-right w-full md:w-1/2">
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
                    Special Winner
                    <InlineSVG src="/icons/required-icon.svg" />
                  </label>
                  <input type="text" id="specialRewards" />
                  <div className="relative">
                    <InlineSVG
                      src="/icons/dollar.svg"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
                    />
                  </div>
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
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
                    />
                  </div>
                </div>

                <div className="create-campaign-toggle">
                  <label
                    htmlFor="publiclyVisible"
                    className="create-campaign-toggle-label"
                  >
                    Publicly Visible
                  </label>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="submitButton" onClick={toggleCampaignModal}>
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
