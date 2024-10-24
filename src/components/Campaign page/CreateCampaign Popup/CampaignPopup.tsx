import React from "react";
import "./CampaignPopup.css";
import InlineSVG from "react-inlinesvg";
interface CampaignCreationPopupProps {
  onClose: () => void;
}
const CampaignPopup: React.FC<CampaignCreationPopupProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" />
        </button>
        <h2 className="popup-title">Create Campaign</h2>

        <h3 className="section-title">Coins Breakup</h3>

        <div className="breakdown-content">
          <div className="breakdown-row">
            <span className="description">
              Campaign Creation Cost (No of days x 10000)
            </span>
            <span className="calculation">4 x 10000</span>
            <span className="highlight">40000</span>
          </div>

          <div className="breakdown-row">
            <span className="description">
              Special Rewards for Participants
            </span>
            <span className="calculation">5 x 1000</span>
            <span className="highlight">5000</span>
          </div>

          <hr className="divider" />

          <div className="total-cost">
            <span>Total Creation Cost</span>
            <span></span>
            <span className="highlight">45000 GFXvs</span>
          </div>
        </div>

        <div className="popup-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel Creation
          </button>
          <div className="campaignpopup-btn-Wrapper">
            <button className="campaignpopup-btn ">Create Campaign</button>

            <div className="campaignpopup-btn-Border" />

            <div className="campaignpopup-btn-Overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPopup;
