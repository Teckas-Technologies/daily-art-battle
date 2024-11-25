import { useState } from "react";
import "./AllParticipants.css";
interface AllParticipantsPopupProps {
  onClose: () => void;
  onDistribute: () => void;
  selectedArtLength: number;
  artLength: number;
}

const AllParticipantpopup: React.FC<AllParticipantsPopupProps> = ({
  onClose,
  onDistribute,
  selectedArtLength,
  artLength,
}) => {
  return (
    <div className="Allparticipant-popup-overlay">
      <div className="Allparticipant-popup-content">
        <h2 className="Allparticipant-popup-title">Distribute Rewards</h2>
        <p className="Allparticipant-main-text">
          All the {artLength} participants will receive rewards
        </p>
        <p className="Allparticipant-description-text ">
          You cannot undo the action, please recheck
        </p>

        <div className="button-container">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <div className="distributepopup-btn-Wrapper">
            <button className="distributepopup-btn " onClick={onDistribute}>
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
export default AllParticipantpopup;
