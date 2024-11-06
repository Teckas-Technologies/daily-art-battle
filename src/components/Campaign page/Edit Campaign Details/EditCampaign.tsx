import React, { useRef, useState, useEffect } from "react";
import "./EditCampaign.css";
import InlineSVG from "react-inlinesvg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCampaigns, { CampaignPageData } from "@/hooks/CampaignHook";
import { signOut, useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { setAuthToken } from "../../../../utils/authToken";
interface EditCampaignPopupProps {
  onClose: () => void;
  campaign?: CampaignPageData | null;
}

const EditCampaignPopup: React.FC<EditCampaignPopupProps> = ({
  onClose,
  campaign,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [specialRewards, setSpecialRewards] = useState("");
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(false);
  const { data: session, status } = useSession();
  const idToken = session?.idToken || "";
 console.log(">>>>>>>>>>>>>>>>>>>>>",idToken);
 
  const { updateCampaign, loading, error } = useCampaigns(idToken);

  useEffect(() => {
    if (campaign) {
      setStartDate(campaign.startDate ? new Date(campaign.startDate) : null);
      setEndDate(campaign.endDate ? new Date(campaign.endDate) : null);
      setCampaignName(campaign.campaignName || "");
      setWelcomeText(campaign.campaignWelcomeText || "");
      setSpecialRewards(campaign.specialRewards.toString() || "");
      setIsPubliclyVisible(campaign.publiclyVisible || false);
    }
  }, [campaign]);
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      signIn('azure-ad-b2c', { callbackUrl: '/' });
    } else if (status === 'authenticated' && session) {
      // Set the idToken for all API requests
      setAuthToken(session?.idToken || "");
      console.log('Token set for API requests', session);
    }
  }, [status, session]);
  const handleDateChange = (
    date: Date | null,
    setter: React.Dispatch<React.SetStateAction<Date | null>>
  ) => {
    setter(date);
    if (setter === setStartDate) setStartDatePickerOpen(false);
    else setEndDatePickerOpen(false);
  };

  const handleSaveChanges = async (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Current input field values:");
    console.log("Welcome Text:", welcomeText);
    console.log("Campaign Name:", campaignName);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Special Rewards:", specialRewards);
    console.log("Publicly Visible:", isPubliclyVisible);

    const updatedCampaignData: CampaignPageData = {
      _id: campaign?._id || "",
      campaignName,
      campaignWelcomeText: welcomeText,
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
      specialRewards: Number(specialRewards) || 0,
      publiclyVisible: isPubliclyVisible,
      participants:0,
    };

    console.log("Updated Campaign Data:", updatedCampaignData);

    const result = await updateCampaign(updatedCampaignData);

    if (result) {
      onClose();
    }
  };

  return (
    <div className="edit-popup-overlay">
      <div className="edit-popup-container">
        <button className="close-btn" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" className="close-btn-icon" />
        </button>
        <div className="edit-popup-header">
          <h2>Edit Campaign Details</h2>
        </div>

        <form className="create-campaign-form">
          <div className="flex flex-col">
            <div className="create-campaign-input">
              <label htmlFor="welcomeText">Welcome Text</label>
              <input
                type="text"
                id="welcomeText"
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
              />
            </div>
            <div className="create-campaign-input">
              <label htmlFor="campaignName">Campaign Name</label>
              <input
                type="text"
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
              <div className="relative">
                <InlineSVG
                  src="/icons/speaker.svg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 icons"
                />
              </div>
            </div>
            <div className="create-campaign-input">
              <label htmlFor="startDate" className="flex items-center gap-2">
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
                      onChange={(date) => handleDateChange(date, setStartDate)}
                      onClickOutside={() => setStartDatePickerOpen(false)}
                      inline
                      minDate={new Date()}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="create-campaign-input">
              <label htmlFor="endDate" className="flex items-center gap-2">
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
                      onChange={(date) => handleDateChange(date, setEndDate)}
                      onClickOutside={() => setEndDatePickerOpen(false)}
                      inline
                      minDate={new Date()}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="create-campaign-input">
              <label htmlFor="specialRewards">Special Rewards</label>
              <input
                type="text"
                id="specialRewards"
                value={specialRewards}
                onChange={(e) => setSpecialRewards(e.target.value)}
              />
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
                <input
                  type="checkbox"
                  checked={isPubliclyVisible}
                  onChange={() => setIsPubliclyVisible(!isPubliclyVisible)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 btn-group">
            <button className="discard-btn" onClick={onClose}>
              Discard Changes
            </button>
            <button className="save-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default EditCampaignPopup;
