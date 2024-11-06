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
          You only Selected {selectedArtLength}{" "}
          out of {artLength} Special Winners
        </p>
        <p className="participant-description-text  md:w-[350px]">
          Distribute rewards to remaining participants before 7 days of campaign
          ending date, otherwise GFXvs Randomly selects participants and
          distribute rewards
        </p>

        <div className="few-button-container">
          <button className="few-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <div className="few-distributepopup-btn-Wrapper">
            <button className="few-distributepopup-btn " onClick={onDistribute}>
              Distribute Rewards
            </button>

            <div className="few-distributepopup-btn-Border" />

            <div className="few-distributepopup-btn-Overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FewParticipantsPopup;
