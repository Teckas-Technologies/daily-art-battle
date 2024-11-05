"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from "react";
import "./CreateCampaign.css";
import InlineSVG from "react-inlinesvg";
import CampaignSuccess from "../Campaign Success/CampaignSuccess";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCampaigns from "@/hooks/CampaignHook";
import CampaignPopup from "../CreateCampaign Popup/CampaignPopup";
import { CAMPAIGN_CREATION_COST } from "@/config/points";
interface CampaignCreationProps {
  toggleCampaignModal: () => void;
  idToken: string;
}

const CreateCampaign: React.FC<CampaignCreationProps> = ({
  toggleCampaignModal,
  idToken,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [isCampaignCreated, setIsCampaignCreated] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [campaignWelcomeText, setCampaignWelcomeText] = useState<string>("");
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignUrl, setCampaignUrl] = useState<string>("");
  const [displayCampaignUrl, setDisplayCampaignUrl] = useState<string>("");
  const [campaignDays, setCampaignDays] = useState<number>();
  const [noOfWinners, setNoOfWinners] = useState<string>("");
  const [specialWinner, setSpecialWinner] = useState<number>();
  const [points, setPoints] = useState<number>(0);
  const [specialRewards, setSpecialRewards] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("Coins to Create");
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [connectionError,setConnectionError] = useState(false);
  const router = useRouter();
  const { createCampaign } = useCampaigns(idToken);
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPubliclyVisible(event.target.checked);
    console.log("Toggle Value:", event.target.checked);
  };
  const campaignData = {
    campaignUrl,
    campaignName,
    campaignWelcomeText,
    startDate: startDate ? startDate.toISOString() : "",
    endDate: endDate ? endDate.toISOString() : "",
    publiclyVisible: isPubliclyVisible,
    specialRewards: Number(specialRewards) || 0,
    isSpecialRewards: Number(specialRewards) > 0,
    totalRewards: points,
    noOfWinners: Number(noOfWinners) || 0,
    specialWinnerCount: Number(specialWinner) || 0,
  };
  const resetFormFields = () => {
    setCampaignName("");
    setCampaignWelcomeText("");
    setStartDate(null);
    setEndDate(null);
    setSpecialRewards("");
    setPoints(0);
    setButtonText("Coins to Create");
    setIsPubliclyVisible(false);
    setNoOfWinners("");
  };
  const openPopup = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();

    if (isFormValid) {
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const confirmCampaignCreation = async () => {
    setIsPopupOpen(false);
    console.log("Submitting Campaign Data:", campaignData);
    const response = await createCampaign(campaignData);
    console.log("response from creation", response);
    if (response.success) {
      const url = `/campaign/success?campaignUrl=${encodeURIComponent(campaignUrl)}`;
      router.push(url);
      resetFormFields();
    } else {
      setConnectionError(true);
      console.error("Error creating campaign:", response.error);
    }
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
  useEffect(() => {
    if (campaignName) {
      const formattedUrl = `https://gfxvs.com/${campaignName
        .replace(/\s+/g, "-")
        .toLowerCase()}`;
      const lastPart = formattedUrl.split("/").pop() || "";
      setDisplayCampaignUrl(formattedUrl);
      setCampaignUrl(lastPart);
    } else {
      setDisplayCampaignUrl("");
      setCampaignUrl("");
    }
  }, [campaignName]);

  useEffect(() => {
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      const totalWinners = dayDiff * 2;
      setNoOfWinners(totalWinners.toString());
    } else {
      setNoOfWinners("");
    }
  }, [startDate, endDate]);
  useEffect(() => {
    if (startDate && endDate) {
      const campaignCost = CAMPAIGN_CREATION_COST;
      const timeDiff = endDate.getTime() - startDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      setCampaignDays(dayDiff);

      const numericSpecialRewards = Number(specialRewards) || 0;

      const calculatedPoints = dayDiff * campaignCost + numericSpecialRewards;

      setPoints(calculatedPoints);

      setButtonText(`${calculatedPoints}`);
    } else {
      setPoints(0);
      setButtonText("Coins to Create");
    }
  }, [startDate, endDate, specialRewards]);

  const formatDate = (date: Date | null): string => {
    if (!date) return "";

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const validateForm = () => {
    const numericSpecialRewards = Number(specialRewards);
    const isValid =
      campaignName.trim() !== "" &&
      startDate !== null &&
      endDate !== null &&
      numericSpecialRewards > 0;

    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [campaignName, startDate, endDate, specialRewards]);
  return (
    <>
      <div className="create-campaign">
        <div
          className="flex gap-1 items-center camapign-path md:mb-9"
          style={{ paddingTop: "80px" }}
        >
          <button className="camapign-path-button">GFXvs</button>
          <InlineSVG src="/icons/green-arrow.svg" style={{ fill: "#00ff00" }} />
          <h3
            style={{
              color: "#ffffff",
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
            {buttonText}
          </button>
        </div>

        <form className="create-campaign-form" onSubmit={openPopup}>
          <div className="create-campaign-firstrow">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={campaignWelcomeText}
              onChange={(e) => setCampaignWelcomeText(e.target.value)}
              placeholder="Welcome message for participants"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start mt-8 gap-0 md:gap-[60px]">
            <div className="create-campaign-left w-full md:w-1/2">
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 input-icon"
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
                  value={startDate ? formatDate(startDate) : ""}
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
                        minDate={new Date()}
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
                  value={endDate ? formatDate(endDate) : ""}
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
                <label htmlFor="noOfWinners" style={{ color: "#5F5F5F" }}>
                  No of Winners
                </label>
                <input
                  type="text"
                  id="noOfWinners"
                  value={noOfWinners}
                  readOnly
                />
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
                <input
                  type="text"
                  id="campaignUrl"
                  value={displayCampaignUrl}
                  readOnly
                />
              </div>
              <div className="create-campaign-input">
                <label
                  htmlFor="specialWinner"
                  className="flex items-center gap-2"
                >
                  Special Winner
                  <InlineSVG src="/icons/required-icon.svg" />
                </label>
                <input
                  type="text"
                  id="specialWinner"
                  value={specialWinner}
                  onChange={(e) => setSpecialWinner(Number(e.target.value))}
                />
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
                <input
                  type="text"
                  id="specialRewards"
                  value={specialRewards}
                  onChange={(e) => setSpecialRewards(e.target.value)}
                />
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
                  <input
                    type="checkbox"
                    id="publiclyVisible"
                    checked={isPubliclyVisible}
                    onChange={handleToggleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {isFormValid ? (
            <div className="submit-btn-Wrapper">
              <button className="submit-btn" type="submit">
                Create Campaign
              </button>
              <div className="submit-btn-Border" />
              <div className="submit-btn-Overlay" />
            </div>
          ) : (
            <button className="submitButton" onClick={toggleCampaignModal}>
              Create Campaign
            </button>
          )}
        </form>
        <CampaignPopup
          isOpen={isPopupOpen}
          onClose={closePopup}
          onConfirm={confirmCampaignCreation}
          specialWinner={specialWinner}
          campaignDays={campaignDays}
          campaignCost={CAMPAIGN_CREATION_COST}
          idToken={idToken}
          connectionError={connectionError}
        />
      </div>
    </>
  );
};

export default CreateCampaign;
