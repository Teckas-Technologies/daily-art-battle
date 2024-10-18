"use client";
import React from "react";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import { Header } from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { UpcomingGrid } from "@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid";

interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: string;
}

const CurrentCampaign: React.FC<Props> = ({
  toggleUploadModal,
  campaignId,
  fontColor,
  welcomeText,
  themeTitle,
}) => {
  return (
    <div style={{backgroundColor:"#000000"}}>
      <Header />
      <CampaignHeader />
      <Battle
        toggleUploadModal={toggleUploadModal}
        campaignId={campaignId}
        fontColor={fontColor}
        welcomeText={welcomeText}
        themeTitle={themeTitle}
      />

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
