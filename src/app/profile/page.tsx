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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoinOpen,setIsCoinOpen] = useState(false);
  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };
  const handleCoinClick = () => {
    setIsCoinOpen(true);
  };
  const closeCoinModal = () => {
    setIsCoinOpen(false);
  };
  return (
    <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh] px-[20px] md:px-[80px] lg:px-[90px] xl:px-[110px] xxl:px-[130px]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <Header/>
      <ProfilePath/>
      <ProfileHeader onEditClick={handleEditClick} handleCoinClick={handleCoinClick}/>
        <ConnectWallet/>
        <FooterMenu/>

        {isEditOpen && <EditProfilePopup onClose={closeEditModal} />}
        {isCoinOpen && <CoinPurchasePopup onClose={closeCoinModal} />}
   </main>
  )
}

export default page