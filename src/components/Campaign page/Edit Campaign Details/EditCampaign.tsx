"use client";
import React, { useRef } from "react";
import "./EditCampaign.css";
import InlineSVG from "react-inlinesvg";
interface EditCampaignPopupProps {
  onClose: () => void;
}
const EditCampaignPopup: React.FC<EditCampaignPopupProps> = ({ onClose }) => {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const openDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.showPicker();
  };
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" />
        </button>
        <div className="edit-popup-header">
          <h2>Edit Campaign Details</h2>
        </div>

        <form className="create-campaign-form">
          <div className="flex flex-col">
            <div className="create-campaign-input">
              <label htmlFor="campaignName">Welcome Text</label>
              <input type="text" id="campaignName" />
            </div>
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
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="custom-date-input"
                ref={startDateRef}
                onFocus={() => openDatePicker(startDateRef)}
              />
              <div className="relative">
                <InlineSVG
                  src="/icons/calender.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="create-campaign-input">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                className="custom-date-input"
                ref={endDateRef}
                onFocus={() => openDatePicker(endDateRef)}
              />
              <div className="relative">
                <InlineSVG
                  src="/icons/calender.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>

            <div className="create-campaign-input">
              <label htmlFor="specialRewards">Special Rewards</label>
              <input type="text" id="specialRewards" />
              <div className="relative">
                <InlineSVG
                  src="/icons/dollar.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
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
          <div className="flex items-center justify-center gap-5 btn-group">
            <button className="discard-btn" onClick={onClose}>
              Discard Changes
            </button>
            <button className="save-btn" onClick={onClose}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaignPopup;
