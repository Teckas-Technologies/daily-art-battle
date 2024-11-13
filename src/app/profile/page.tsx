'use client'
import { FooterMenu } from '@/components/FooterMenu/FooterMenu'
import { Header } from '@/components/Header/Header'
import CoinPurchasePopup from '@/components/Profile Page/BuyCoins Popup/BuyCoins'
import ConnectWallet from '@/components/Profile Page/Connect Wallet/ConnectWallet'
import EditProfilePopup from '@/components/Profile Page/EditProfile Popup/EditProfilePopup'
import ProfilePath from '@/components/Profile Page/Profile Path/ProfilePath'

import ProfileHeader from '@/components/Profile Page/ProfileHeader/ProfileHeader'
import { GFX_CAMPAIGNID } from '@/config/constants'
import React, { useState } from 'react'

const page = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="container-profile bg-[#000000] w-full min-h-screen lg: px-[110px] ">
      <Header openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <ProfilePath/>
      <ProfileHeader onEditClick={handleEditClick}/>
        <ConnectWallet/>
        <FooterMenu fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />

        {isModalOpen && <EditProfilePopup onClose={handleCloseModal} />}
    </div>
  )
}

export default page