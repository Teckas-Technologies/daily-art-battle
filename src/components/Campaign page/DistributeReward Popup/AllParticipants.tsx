import { useState } from "react";
import "./AllParticipants.css";
interface AllParticipantsPopupProps {
  onClose: () => void;
}

const AllParticipantpopup: React.FC<AllParticipantsPopupProps> = ({
  onClose,
}) => {
  return (
    <div className="Allparticipant-popup-overlay">
      <div className="Allparticipant-popup-content">
        <h2 className="Allparticipant-popup-title">Distribute Rewards</h2>
        <p className="Allparticipant-main-text">
          All the 5 participants will receive rewards
        </p>
        <p className="Allparticipant-description-text ">
          You cannot undo the action, please recheck
        </p>

        <div className="button-container">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <div className="distributepopup-btn-Wrapper">
            <button className="distributepopup-btn ">Distribute Rewards</button>

            <div className="distributepopup-btn-Border" />

            <div className="distributepopup-btn-Overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllParticipantpopup;
