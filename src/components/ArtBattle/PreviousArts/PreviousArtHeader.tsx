import React from "react";
import "./PreviousArtHeader.css";

const PreviousArtHeader = () => {
  return (
    
    <div className="previous-container">
      <div className="previous-arts">
        <div className="previous-heading md:px-[7.8rem] px-3 ">
          <h1>UNLOCK SPECIAL REWARDS</h1>
          <div className="previous-text">
          Previous <span>Art Battles</span>
          </div>
          <p className="md:w-[600px]">
            Check your wallet to see your rewards and the spoils of victory if
            you were a lucky winner. Relive the excitement and see which
            masterpieces emerged victorious!
          </p>
        </div>
      </div>
    </div>

  );
};

export default PreviousArtHeader;
