import React, { useState } from "react";
import "./CampaignPopup.css";
import InlineSVG from "react-inlinesvg";
interface CampaignCreationPopupProps {
  onClose: () => void;
}
const CampaignPopup: React.FC<CampaignCreationPopupProps> = ({ onClose }) => {
  const [inSufficientbalance, setInSufficientbalance] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <InlineSVG
          src="/icons/x.svg"
          onClick={onClose}
          className="close-button"
        />

        <h2 className="popup-title">Create Campaign</h2>

        <h3 className="section-title">Coins Breakup</h3>

      <div className="common">
      <div className="breakdown-content">
          <div className="breakdown-row">
            <span className="description">
              Campaign Creation Cost (No of days x 10000)
            </span>
            <div className="calculation-result">
              <span className="calculation">4 x 10000</span>
              <span className="highlight">40000</span>
            </div>
          </div>

          <div className="breakdown-row">
            <span className="description">
              Special Rewards for Participants
            </span>
            <div className="calculation-result">
              <span className="calculation">5 x 1000</span>
              <span className="highlight">5000</span>
            </div>
          </div>

          <hr className="divider" />

          <div className="total-cost">
            <span className="total-cost-text">Total Creation Cost</span>
            <span></span>
            <span className="highlight">45000 GFXvs</span>
          </div>
        </div>
      </div>

        <div className="popup-buttons">
          {connectionError ? (
            <div className="flex flex-col items-center">
              <button className="retry-button">Retry Creation</button>
            </div>
          ) : inSufficientbalance ? (
            <>
              <button className="cancel-button" onClick={onClose}>
                Cancel Creation
              </button>
              <div className="campaignpopup-btn-Wrapper">
                <button className="campaignpopup-btn">Create Campaign</button>

                <div className="campaignpopup-btn-Border" />
                <div className="campaignpopup-btn-Overlay" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <button className="close" onClick={onClose}>
                Close
              </button>
              <p className="alert">Insufficient Balance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignPopup;
