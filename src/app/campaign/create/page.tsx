"use client"
import CreateCampaign from '@/components/Campaign page/Create Campaign/Createcampaign'
import CampaignPopup from '@/components/Campaign page/CreateCampaign Popup/CampaignPopup';
import Footer from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import React, { useState } from 'react'
interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: string;
}
const page = () => {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const toggleCampaignModal = () =>
    setShowCampaignModal(!showCampaignModal);
  return (
    <div style={{ backgroundColor: "#000000" }}>
      <Header/>
      <CreateCampaign toggleCampaignModal={toggleCampaignModal}/>
      {showCampaignModal && (
        <CampaignPopup onClose={() => setShowCampaignModal(false)} />
      )}
      <Footer/>
    </div>
  )
}

export default page