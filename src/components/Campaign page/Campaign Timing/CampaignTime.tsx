import React, { useContext, useEffect, useState } from "react";
import "./CampaignTime.css";
import useCampaigns, { CampaignPageData } from "@/hooks/CampaignHook";
import EditCampaignPopup from "../Edit Campaign Details/EditCampaign";
import ArtUploadForm from "@/components/ArtUpload/ArtUploadForm";
import { NearContext } from "@/wallet/WalletSelector";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "@/components/Toast";

interface CampaignTimeProps {
  campaign?: CampaignPageData | null;
  campaignId: string;
  editCampaign: boolean;
  setEditCampaign: (value: boolean) => void;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  creatorEmail: string | undefined;
  activeEmail: string | undefined;
  handleButtonClick: () => void;
  showEditModal: boolean;
  setShowEditModal: (value: boolean) => void;
  showUploadModal: boolean;
  setShowUploadModal: (value: boolean) => void;
}

const CampaignTime: React.FC<CampaignTimeProps> = ({
  campaign,
  campaignId,
  editCampaign,
  setEditCampaign,
  timeRemaining,
  creatorEmail,
  activeEmail,
  handleButtonClick,
  showEditModal,
  setShowEditModal,
  showUploadModal,
  setShowUploadModal,
}) => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [specialRewards, setSpecialRewards] = useState("");
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(false);
  const { updateCampaign, isLoading, isError } = useCampaigns();
  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
  }, [toast]);
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
  const handleDateChange = (
    date: Date | null,
    setter: (value: Date | null) => void
  ) => {
    setter(date);
    if (setter === setStartDate) setStartDatePickerOpen(false);
    else setEndDatePickerOpen(false);
  };
  const handleSaveChanges = async () => {
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
      participants: 0,
      email: campaign?.email || "",
    };

    console.log("Updated Campaign Data:", updatedCampaignData);

    const result = await updateCampaign(updatedCampaignData);

    if (result) {
      setEditCampaign(!editCampaign);
      setShowUploadModal(false);
      setSuccessToast("yes");
      setToast(true);
      setToastMessage("Campaign Updated Successfully");
    } else {
      console.error("Failed to distribute art");
      setToast(true);
      setToastMessage("Failed to edit campaign details");
      setSuccessToast("no");
      setShowUploadModal(false);
    }
  };
  const handleCloseArtPrompt = ()=>{
    setShowUploadModal(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("openupload");
    window.history.replaceState(null, "", url.toString());
  }
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => {
        setToast(false);
        setToastMessage("");
        setSuccessToast("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [toast]);
  return (
    <div className="campaign-timings">
      <h3>Campaign Starts in</h3>
      <h1>
        {timeRemaining.days === 1 ? "1 Day" : `${timeRemaining.days} Days`}{" "}
        {timeRemaining.hours.toString().padStart(2, "0")}:
        {timeRemaining.minutes.toString().padStart(2, "0")}:
        {timeRemaining.seconds.toString().padStart(2, "0")}
      </h1>

      <div className="CampaignButtonWrapper">
        <button className="Campaignbtn" onClick={handleButtonClick}>
          {creatorEmail === activeEmail
            ? "Edit Campaign Details"
            : "Upload Your Art"}
        </button>
        <div className="CampaignButtonBorder" />
        <div className="CampaignButtonOverlay" />
      </div>
      {showEditModal && (
        <EditCampaignPopup
          onClose={() => setShowEditModal(false)}
          campaign={campaign}
          setEditCampaign={setEditCampaign}
          editCampaign={editCampaign}
          welcomeText={welcomeText}
          setWelcomeText={setWelcomeText}
          campaignName={campaignName}
          setCampaignName={setCampaignName}
          startDate={startDate}
          setStartDate={setStartDate}
          setStartDatePickerOpen={setStartDatePickerOpen}
          handleDateChange={handleDateChange}
          endDate={endDate}
          setEndDatePickerOpen={setEndDatePickerOpen}
          specialRewards={specialRewards}
          setSpecialRewards={setSpecialRewards}
          isPubliclyVisible={isPubliclyVisible}
          setIsPubliclyVisible={setIsPubliclyVisible}
          handleSaveChanges={handleSaveChanges}
          isEndDatePickerOpen={isEndDatePickerOpen}
          isStartDatePickerOpen={isStartDatePickerOpen}
          setEndDate={setEndDate}
        />
      )}
      {showUploadModal && (
        <ArtUploadForm
          campaignId={campaignId}
          onClose={handleCloseArtPrompt}
          onSuccessUpload={() => setUploadSuccess(true)}
          setSignToast={setSignToast}
          setErrMsg={setErrMsg}
          setToast={setToast}
          setSuccessToast={setSuccessToast}
          setToastMessage={setToastMessage}
        />
      )}
      {toast && toastMessage && (
        <div
          className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden"
          style={{ zIndex: 55 }}
        >
          <div className="relative w-full h-full">
            <Toast
              success={successToast === "yes"}
              message={toastMessage}
              onClose={() => {
                setToast(false);
                setToastMessage("");
                setSuccessToast("");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTime;
