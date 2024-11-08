import React, { useEffect, useState } from "react";
import "./CampaignPopup.css";
import InlineSVG from "react-inlinesvg";
import { CAMPAIGN_CREATION_COST, SPECIAL_WINNER } from "@/config/points";
import { useSendWalletData } from "@/hooks/saveUserHook";
import { useMbWallet } from "@mintbase-js/react";
import useCampaigns from "@/hooks/CampaignHook";

interface CampaignCreationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  specialWinner?: number;
  campaignDays?: number;
  campaignCost?: number;
  idToken: string;
  connectionError: boolean;
  specialRewards: string;
}
const CampaignPopup: React.FC<CampaignCreationPopupProps> = ({
  onClose,
  onConfirm,
  isOpen,
  specialWinner,
  campaignDays,
  campaignCost,
  idToken,
  connectionError,
  specialRewards,
}) => {
  const [inSufficientbalance, setInSufficientbalance] = useState(true);

  const { activeAccountId, isConnected } = useMbWallet();
  const { userDetails, sendWalletData, sufficientBalance } =
    useSendWalletData();
  useEffect(() => {
    if (isOpen && activeAccountId) {
      const walletAddress = activeAccountId;
      sendWalletData(walletAddress);
    }
  }, [isOpen, idToken, sendWalletData]);

  useEffect(() => {
    const creationCost = (campaignDays || 0) * CAMPAIGN_CREATION_COST;
    const specialRewardCost = (specialWinner || 0) * Number(specialRewards);
    const totalCost = creationCost + specialRewardCost;

    if (sufficientBalance !== null) {
      setInSufficientbalance(sufficientBalance >= totalCost);
    }
  }, [sufficientBalance, campaignDays, specialWinner]);

  if (!isOpen) return null;
  const creationCost = (campaignDays || 0) * CAMPAIGN_CREATION_COST;
  const specialRewardCost = (specialWinner || 0) * SPECIAL_WINNER;
  const totalCost = creationCost + specialRewardCost;
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
                <span className="calculation">{campaignDays} x 10000</span>
                <span className="highlight">{creationCost}</span>
              </div>
            </div>

            {specialWinner && (
              <div className="breakdown-row">
                <span className="description">
                  Special Rewards for Participants
                </span>
                <div className="calculation-result">
                  <span className="calculation">{specialWinner} x 1000</span>
                  <span className="highlight">{specialRewardCost}</span>
                </div>
              </div>
            )}

            <hr className="divider" />

            <div className="total-cost">
              <span className="total-cost-text">Total Creation Cost</span>
              <span></span>
              <span className="highlight">{totalCost} GFXvs</span>
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
                <button className="campaignpopup-btn" onClick={onConfirm}>
                  Create Campaign
                </button>

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
// CampaignPopUp.tsx
