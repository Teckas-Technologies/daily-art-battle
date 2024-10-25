'use client'
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import CampaignTime from "@/components/Campaign page/Campaign Timing/CampaignTime";
import EditCampaignPopup from "@/components/Campaign page/Edit Campaign Details/EditCampaign";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { GFX_CAMPAIGNID } from "@/config/constants";
import React, { useState } from "react";
import InlineSVG from "react-inlinesvg";
interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: string;
}
const handleNavigation = () => {
  window.location.href = "/campaign";
};
const UpcomingCampaign = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const toggleUEditModal = () => setShowEditModal(!showEditModal);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  return (
    <div style={{ backgroundColor: "#000000" }}>
      <Header />
      <div className="camapign-path-container">
    <button className="camapign-path-button">GFXvs</button>
    <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
    <h3
      style={{
        color: "#ffffff",
        
        cursor: "pointer",
      }}
      onClick={handleNavigation}
    >
      Campaigns
    </h3>
    <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
    <h3 style={{ color: "#00ff00", textDecoration: "underline" }}>
      Upcoming Campaign
    </h3>
  </div>
      <CampaignHeader />
       <CampaignTime toggleUEditModal={toggleUEditModal} />
      {showEditModal && <EditCampaignPopup onClose={() => setShowEditModal(false)}/>}
      <PreviousGrid fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} />
      
      <Footer />
    </div>
  );
};

export default UpcomingCampaign;
