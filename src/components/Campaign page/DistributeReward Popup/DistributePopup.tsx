import { useState } from "react";
import "./DistributePopup.css";
import InlineSVG from "react-inlinesvg";
import useCampaigns, { ArtItem } from "@/hooks/CampaignHook";
import AllParticipantpopup from "./AllParticipants";
import FewParticipantsPopup from "./FewParticipants";

interface DistributeRewardPopupProps {
  onClose: () => void;
  campaignId: string;
  art: ArtItem[];
  idToken: string;
  selectedArt: number[];
  toggleSelection: (index: number) => void;
  handlePopups: () => void;
  SpecialWinnerCount: number | "";
}

const DistributeRewardPopup: React.FC<DistributeRewardPopupProps> = ({
  onClose,
  campaignId,
  art,
  idToken,
  selectedArt,
  toggleSelection,
  handlePopups,
  SpecialWinnerCount,
}) => {
  const maxSelections =
    typeof SpecialWinnerCount === "number" ? SpecialWinnerCount : 0;

  const isLimitReached = selectedArt.length >= maxSelections;

  return (
    <div className="distribute-popup">
      <h1>Distribute Rewards</h1>
      <div className="grid">
        {art.map((item, index) => {
          const isSelected = selectedArt.includes(index);
          const isDisabled = isLimitReached && !isSelected;

          return (
            <div
              key={item._id}
              className={`distribute-card ${isSelected ? "selected" : ""} ${
                isDisabled ? "disabled" : ""
              }`}
              onClick={() => {
                if (!isDisabled || isSelected) {
                  toggleSelection(index);
                }
              }}
              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
            >
              <img
                src={item.colouredArt}
                alt={item.arttitle}
                className="user-image"
              />
              <div className={`checkmark ${isSelected ? "selected" : ""}`}>
                {isSelected && <InlineSVG src="/icons/tick.svg" />}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {item.artistId.length > 10
                    ? `${item.artistId.slice(0, 10)}...`
                    : item.artistId}
                </span>
                <span className="user-upvotes flex flex-row items-center">
                  <InlineSVG
                    src="/icons/heart.svg"
                    className="w-[15px] h-[15px]"
                  />{" "}
                  {item.upVotes} Upvotes
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer">
        <div className="reward-result">
          Selected {selectedArt.length} out of {art.length} Participants
        </div>
        <div className="actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <div className="distributepopup-btn-Wrapper">
            <button className="distributepopup-btn" onClick={handlePopups}>
              Distribute Rewards
            </button>
            <div className="distributepopup-btn-Border" />
            <div className="distributepopup-btn-Overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributeRewardPopup;
