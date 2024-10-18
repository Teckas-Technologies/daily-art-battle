"use client";
import React from "react";
import CampaignHeader from "../Campaign Header/CampaignHeader";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import { Header } from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

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
    <div className="current-campaign-container">
      <Header />
      <CampaignHeader />
      <Battle
        toggleUploadModal={toggleUploadModal}
        campaignId={campaignId}
        fontColor={fontColor}
        welcomeText={welcomeText}
        themeTitle={themeTitle}
      />
      <Footer/>
    </div>
  );
};

export default CurrentCampaign;
