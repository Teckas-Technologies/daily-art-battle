"use client";
import React from "react";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import { Header } from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { UpcomingGrid } from "@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid";

import InlineSVG from "react-inlinesvg";
import CurrentCampaigUploadArt from "@/components/Campaign page/Current Campaign/CurrentCampaign";

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
const CurrentCampaign: React.FC<Props> = ({
  toggleUploadModal,
  campaignId,
  fontColor,
  welcomeText,
  themeTitle,
}) => {
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
      <Battle
        toggleUploadModal={toggleUploadModal}
        campaignId={campaignId}
        fontColor={fontColor}
        welcomeText={welcomeText}
        themeTitle={themeTitle}
      />
 <CurrentCampaigUploadArt/>
      <UpcomingGrid
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={false}
        campaignId={campaignId}
        fontColor={fontColor}
      />
      <PreviousArtHeader />
      <PreviousGrid
        toggleUploadModal={toggleUploadModal}
        campaignId={campaignId}
        fontColor={fontColor}
      /> 
      <Footer />
    </div>
  );
};

export default CurrentCampaign;
