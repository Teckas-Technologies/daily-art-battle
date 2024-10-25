"use client";
import React, { useState } from "react";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import { Header } from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { UpcomingGrid } from "@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid";
import { GFX_CAMPAIGNID } from "@/config/constants";
import InlineSVG from "react-inlinesvg";
import CurrentCampaigUploadArt from "@/components/Campaign page/Current Campaign/CurrentCampaign";

const handleNavigation = () => {
  window.location.href = "/campaign";
};

const CurrentCampaign = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
          Current Campaign
        </h3>
      </div>
      <CampaignHeader />
      <Battle campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} fontColor={""} welcomeText={""} themeTitle={""} />
      <CurrentCampaigUploadArt/>
      <UpcomingGrid fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <PreviousArtHeader/>
      <PreviousGrid fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} />

      <Footer />
    </div>
  );
};

export default CurrentCampaign;
