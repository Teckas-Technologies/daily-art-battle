"use client";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import DistributeRewardPopup from "@/components/Campaign page/DistributeReward Popup/DistributePopup";
import FewParticipantsPopup from "@/components/Campaign page/DistributeReward Popup/FewParticipants";
import AllParticipantsPopup from "@/components/Campaign page/DistributeReward Popup/AllParticipants"; // Import new popup

import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import React, { useState } from "react";
import InlineSVG from "react-inlinesvg";

const handleNavigation = () => {
  window.location.href = "/campaign";
};

const page = () => {
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState<boolean | null>(null);

  const toggleDistributeModal = () => {
    setShowDistributeModal(!showDistributeModal);
  };

  const handleDistribute = (hasManyParticipants: boolean) => {
    setShowDistributeModal(false);
    setShowAllParticipants(hasManyParticipants); 
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000000" }}>
      <Header />
      <div className="camapign-path-container">
        <button className="camapign-path-button">GFXvs</button>
        <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
        <h3
          style={{ color: "#ffffff", cursor: "pointer" }}
          onClick={handleNavigation}
        >
          Campaigns
        </h3>
        <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
        <h3 style={{ color: "#00ff00", textDecoration: "underline" }}>
          Current Campaign
        </h3>
      </div>
      <CampaignHeader />
      <CampaignDetails toggleDistributeModal={toggleDistributeModal} />
      
      {showDistributeModal && (
        <DistributeRewardPopup
          onDistribute={() => handleDistribute(true)} 
          onClose={() => setShowDistributeModal(false)}
        />
      )}

      {showAllParticipants === true && (
        <AllParticipantsPopup onClose={() => setShowAllParticipants(null)} />
      )}
      {showAllParticipants === false && (
        <FewParticipantsPopup onClose={() => setShowAllParticipants(null)} />
      )}

      <Footer />
    </div>
  );
};

export default page;
