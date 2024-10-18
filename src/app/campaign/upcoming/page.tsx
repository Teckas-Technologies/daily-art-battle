'use client'
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";
import CampaignTime from "@/components/Campaign page/Campaign Timing/CampaignTime";
import EditCampaignPopup from "@/components/Campaign page/Edit Campaign Details/EditCampaign";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import React, { useState } from "react";
interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: string;
}
const UpcomingCampaign: React.FC<Props> = ({
  toggleUploadModal,
  campaignId,
  fontColor,
  welcomeText,
  themeTitle,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const toggleUEditModal = () => setShowEditModal(!showEditModal);
  return (
    <div style={{ backgroundColor: "#000000" }}>
      <Header />
      <CampaignHeader />
      <CampaignTime toggleUEditModal={toggleUEditModal} />
      {showEditModal && <EditCampaignPopup onClose={() => setShowEditModal(false)}/>}
      <PreviousGrid
        toggleUploadModal={toggleUploadModal}
        campaignId={campaignId}
        fontColor={fontColor}
      />
      {/* <EditCampaignPopup/> */}
      <Footer />
    </div>
  );
};

export default UpcomingCampaign;
