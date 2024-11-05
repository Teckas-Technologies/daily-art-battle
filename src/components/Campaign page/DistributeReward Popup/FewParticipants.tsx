import { useState } from "react";
import "./FewParticipants.css";
interface FewParticipantsPopupProps {
  onClose: () => void;
  onDistribute: () => void;
  selectedArtLength: number;
  artLength: number;
}

const FewParticipantsPopup: React.FC<FewParticipantsPopupProps> = ({
  onClose,
  onDistribute,
  selectedArtLength,
  artLength
}) => {
  return (
    <div className="participant-popup-overlay">
      <div className="participant-popup-content">
        <h2 className="participant-popup-title">Distribute Rewards</h2>
        <p className="main-text">
          You only Selected <span className="count">{selectedArtLength}</span>{" "}
          out of <span className="count">{artLength}</span> Special Winners
        </p>
        <p className="participant-description-text  md:w-[350px]">
          Distribute rewards to remaining participants before 7 days of campaign
          ending date, otherwise GFXvs Randomly selects participants and
          distribute rewards
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
export default FewParticipantsPopup;
