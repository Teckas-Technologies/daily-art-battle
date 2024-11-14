import React, { useEffect, useState } from "react";
import "./CampaignTime.css";
import { CampaignPageData } from "@/hooks/CampaignHook";
import { useMbWallet } from "@mintbase-js/react";
import EditCampaignPopup from "../Edit Campaign Details/EditCampaign";
import ArtUploadForm from "@/components/ArtUpload/ArtUploadForm";
import { useAuth } from "@/contexts/AuthContext";

interface CampaignTimeProps {
  campaign?: CampaignPageData | null;
  campaignId: string;
  setEditCampaign: (value: boolean) => void;
}

const CampaignTime: React.FC<CampaignTimeProps> = ({
  campaign,
  campaignId,
  setEditCampaign,
}) => {
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
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { user } = useAuth();
  let userDetails = user;
  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
  }, [toast]);

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
  const creatorEmail = campaign?.email;
  const activeEmail = userDetails?.user?.email;

  const handleButtonClick = () => {
    if (creatorEmail === activeEmail) {
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
        />
      )}
      {showUploadModal && (
        <ArtUploadForm
          campaignId={campaignId}
          onClose={() => setShowUploadModal(false)}
          onSuccessUpload={() => setUploadSuccess(true)}
          setSignToast={setSignToast}
          setErrMsg={setErrMsg}
          setToast={setToast}
          setSuccessToast={setSuccessToast}
          setToastMessage={setToastMessage}
        />
      )}
    </div>
  );
};

export default CampaignTime;
