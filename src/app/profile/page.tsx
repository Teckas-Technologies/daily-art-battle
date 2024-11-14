"use client";
import CampaignSuccess from "@/components/Campaign page/Campaign Success/CampaignSuccess";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import CoinPurchasePopup from "@/components/Profile Page/BuyCoins Popup/BuyCoins";
import ConnectWallet from "@/components/Profile Page/Connect Wallet/ConnectWallet";
import EditProfilePopup from "@/components/Profile Page/EditProfile Popup/EditProfilePopup";
import ProfilePath from "@/components/Profile Page/Profile Path/ProfilePath";
import { ProfileBody } from "@/components/Profile Page/ProfileBody/ProfileBody";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import ProfileHeader from "@/components/Profile Page/ProfileHeader/ProfileHeader";
import { GFX_CAMPAIGNID } from "@/config/constants";
import React, { useState } from "react";
import InlineSVG from "react-inlinesvg";

const page = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);

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

        const transactions = [
    { id: 1, type: "Paid to Art Battles", date: "12 Oct 2024", amount: -100 },
    { id: 2, type: "Paid to Art Battles", date: "12 Oct 2024", amount: -100 },
    { id: 3, type: "Paid to Art Battles", date: "12 Oct 2024", amount: -100 },
    { id: 4, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
    { id: 5, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
    { id: 6, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
    { id: 7, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
  ];
  return (
    <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh] px-3 md:px-[2rem] lg:px-[3rem] xl:px-[7rem] xxl:px-[9rem]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'scroll' }}>
      <Header openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <ProfilePath />
      <ProfileHeader onEditClick={handleEditClick} handleCoinClick={handleCoinClick}/>
      <ConnectWallet />
      <ProfileBody />
      <FooterMenu fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
    <MobileNav
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
      {isEditOpen && <EditProfilePopup onClose={closeEditModal} />}
      {isCoinOpen && <CoinPurchasePopup onClose={closeCoinModal} />}
    </main>
  )
}

export default page;
