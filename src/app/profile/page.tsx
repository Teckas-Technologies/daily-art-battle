'use client'
import { FooterMenu } from '@/components/FooterMenu/FooterMenu'
import { Header } from '@/components/Header/Header'
import CoinPurchasePopup from '@/components/Profile Page/BuyCoins Popup/BuyCoins'
import ConnectWallet from '@/components/Profile Page/Connect Wallet/ConnectWallet'
import EditProfilePopup from '@/components/Profile Page/EditProfile Popup/EditProfilePopup'
import ProfilePath from '@/components/Profile Page/Profile Path/ProfilePath'
import { ProfileBody } from '@/components/Profile Page/ProfileBody/ProfileBody'

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
    <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'scroll' }}>
      <Header openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <ProfilePath />
      <ProfileHeader onEditClick={handleEditClick} />
      <ConnectWallet />
      <ProfileBody />
      <FooterMenu fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />

      {isModalOpen && <EditProfilePopup onClose={handleCloseModal} />}
    </main>
  )
}

export default page