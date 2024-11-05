import React, { useEffect, useState } from "react";
import "./CampaignTime.css";
import { CampaignPageData } from "@/hooks/CampaignHook";
import { useMbWallet } from "@mintbase-js/react";
import EditCampaignPopup from "../Edit Campaign Details/EditCampaign";
import ArtUploadForm from "@/components/ArtUpload/ArtUploadForm";

interface CampaignTimeProps {
  campaign?: CampaignPageData | null;
}

const CampaignTime: React.FC<CampaignTimeProps> = ({ campaign }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { activeAccountId, isConnected } = useMbWallet();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  useEffect(() => {
    if (!campaign || !campaign.startDate) return;

    const startDate = new Date(campaign.startDate).getTime();
    const endDate = campaign.endDate
      ? new Date(campaign.endDate).getTime()
      : null;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeLeft = startDate - now;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        clearInterval(timerId);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [campaign]);
  const creatorId = campaign?.creatorId;
  const handleButtonClick = () => {
    if (creatorId === activeAccountId) {
      setShowEditModal(true);
    } else {
      setShowUploadModal(true);
    }
  };
  return (
    <div className="campaign-timings">
      <h3>Campaign Starts in</h3>
      <h1>
        {timeRemaining.days} Days{" "}
        {timeRemaining.hours.toString().padStart(2, "0")}:
        {timeRemaining.minutes.toString().padStart(2, "0")}:
        {timeRemaining.seconds.toString().padStart(2, "0")}
      </h1>
      <div className="CampaignButtonWrapper">
        <button className="Campaignbtn" onClick={handleButtonClick}>
          {creatorId === activeAccountId
            ? "Edit Campaign Details"
            : "Upload Your Art"}
        </button>
        <div className="CampaignButtonBorder" />
        <div className="CampaignButtonOverlay" />
      </div>
      {showEditModal && (
        <EditCampaignPopup onClose={() => setShowEditModal(false)} campaign={campaign}/>
      )}
      {showUploadModal && (
        <ArtUploadForm
          campaignId={""}
          onClose={() => setShowUploadModal(false)}
          onSuccessUpload={() => setUploadSuccess(true)}
        />
      )}
    </div>
  );
};

export default CampaignTime;
