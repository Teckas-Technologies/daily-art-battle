'use client'
import { FooterMenu } from '@/components/FooterMenu/FooterMenu'
import { Header } from '@/components/Header/Header'
import CoinPurchasePopup from '@/components/Profile Page/BuyCoins Popup/BuyCoins'
import ConnectWallet from '@/components/Profile Page/Connect Wallet/ConnectWallet'
import EditProfilePopup from '@/components/Profile Page/EditProfile Popup/EditProfilePopup'
import ProfilePath from '@/components/Profile Page/Profile Path/ProfilePath'

import ProfileHeader from '@/components/Profile Page/ProfileHeader/ProfileHeader'
import React, { useState } from 'react'

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="container-profile bg-[#000000] w-full min-h-screen lg: px-[110px] ">
      <Header/>
      <ProfilePath/>
      <ProfileHeader onEditClick={handleEditClick}/>
        <ConnectWallet/>
        <FooterMenu/>

        {isModalOpen && <EditProfilePopup onClose={handleCloseModal} />}
    </div>
  )
}

export default page