import React from "react";
import "./CampaignTime.css";
interface CampaignTimeProps {
  toggleUEditModal: () => void;
}
interface EditCampaignPopupProps {
  onClose: () => void;
}
const CampaignTime: React.FC<CampaignTimeProps> = ({ toggleUEditModal }) => {
  return (
    <div className="campaign-timings">
      <h3>Campaign Starts in</h3>
      <h1>7 Days 14:28:06</h1>
      <div className="CampaignButtonWrapper">
        <button className="Campaignbtn"  onClick={toggleUEditModal}>Edit Campaign Details</button>

        <div className="CampaignButtonBorder" />

        <div className="CampaignButtonOverlay" />
      </div>
    </div>
  );
};

export default CampaignTime;
