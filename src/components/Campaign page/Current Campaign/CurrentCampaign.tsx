"use client";
import React from "react";
import './CurrentCampaign.css'
const CurrentCampaigUploadArt = () => {
  return (
    <div className="current-campaign-uploadart">
      <p className="current-uploadart-text w-full sm:w-[100px] md:w-[500px] text-center">
       Want to show your Talent?! Upload your own masterpiece and join the competition!
     </p>
     <div className="currentButtonWrapper">
       <button className="currentbtn">Upload Art</button>

       <div className="currentButtonBorder" />

       <div className="currentButtonOverlay" />
     </div>
 </div>
  )
 
};

export default CurrentCampaigUploadArt;
