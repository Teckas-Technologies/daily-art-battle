"use client";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import DistributeRewardPopup from "@/components/Campaign page/DistributeReward Popup/DistributePopup";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
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
const page = () => {
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const toggleDistributeModal = () =>
    setShowDistributeModal(!showDistributeModal);
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000000" }}>
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
          Current Campaign
        </h3>
      </div>
      <CampaignHeader />
      <CampaignDetails toggleDistributeModal={toggleDistributeModal} />
      {showDistributeModal && (
        <DistributeRewardPopup onClose={() => setShowDistributeModal(false)} />
      )}
      <Footer />
    </div>
  );
};

export default page;
