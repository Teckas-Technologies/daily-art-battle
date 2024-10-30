import { useState } from "react";
import "./FewParticipants.css";
interface FewParticipantsPopupProps {
  onClose: () => void;
}

const FewParticipantsPopup: React.FC<FewParticipantsPopupProps> = ({
  onClose,
}) => {
  return (
    <div className="participant-popup-overlay">
      <div className="participant-popup-content">
        <h2 className="participant-popup-title">Distribute Rewards</h2>
        <p className="main-text">
          You only Selected <span className="count">2</span> out of{" "}
          <span className="count">5</span> Special Winners
        </p>
        <p className="description-text  md:w-[460px]">
          Distribute rewards to remaining participants before 7 days of campaign
          ending date, otherwise GFXvs Randomly selects participants and
          distribute rewards
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
export default FewParticipantsPopup;
