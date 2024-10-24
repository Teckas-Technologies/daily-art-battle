"use client";
import React, { useRef, useState } from "react";
import "./EditCampaign.css";
import InlineSVG from "react-inlinesvg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface EditCampaignPopupProps {
  onClose: () => void;
}
const EditCampaignPopup: React.FC<EditCampaignPopupProps> = ({ onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const handleDateChange = (
    date: Date | null,
    setter: React.Dispatch<React.SetStateAction<Date | null>>
  ) => {
    setter(date);
    if (setter === setStartDate) setStartDatePickerOpen(false);
    else setEndDatePickerOpen(false);
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 icons"
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
              <label htmlFor="specialRewards">Special Rewards</label>
              <input type="text" id="specialRewards" />
              <div className="relative">
                <InlineSVG
                  src="/icons/dollar.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 icons"
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
