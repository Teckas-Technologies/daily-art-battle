"use client";
import CampaignSuccess from "@/components/Campaign page/Campaign Success/CampaignSuccess";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import CoinPurchasePopup from "@/components/Profile Page/BuyCoins Popup/BuyCoins";
import EditProfilePopup from "@/components/Profile Page/EditProfile Popup/EditProfilePopup";
import ProfilePath from "@/components/Profile Page/Profile Path/ProfilePath";
import { ProfileBody } from "@/components/Profile Page/ProfileBody/ProfileBody";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import ProfileHeader from "@/components/Profile Page/ProfileHeader/ProfileHeader";
import { GFX_CAMPAIGNID } from "@/config/constants";
import React, { useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import DailyCheckin from "@/components/Profile Page/DailyCheckin/DailyCheckin";
import { MintBurnPopup } from "@/components/PopUps/MintBurnPopup";
import { ConfirmPopupInfo } from "@/types/types";
import useNearTransfer from "@/hooks/nearTransferHook";

const page = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState<ConfirmPopupInfo>({
    info: "",
    text: "",
    isMint: false
  });

const {postNearTransfer} = useNearTransfer();

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
  useEffect(() => {
    const fetchTransactionStatusAndHandleAccount = async () => {
      const searchParams = new URLSearchParams(window.location.search);

      const accountId = searchParams.get("account_id") || "";
      const txnHash = searchParams.get("transactionHashes") || "";

      console.log("Wallet Address (Account ID):", accountId);
      console.log("Transaction Hash:", txnHash);
      if (accountId && txnHash) {
       const response = await postNearTransfer(accountId, txnHash);
       console.log("--------",response);
       
      }
    };

    fetchTransactionStatusAndHandleAccount();
  }, []);

      const closeMintBurnPopup = () => {
        setConfirmPopup({ info: "", text: "", isMint: false })
      }
  return (
    <main
      className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh] px-3 md:px-[2rem] lg:px-[3rem] xl:px-[7rem] xxl:px-[9rem]"
      style={{
        backgroundPosition: "top",
        backgroundSize: "cover",
        overflowX: "hidden",
        overflowY: "scroll",
      }}
    >
      <Header
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
      <ProfilePath />
      <ProfileHeader
        onEditClick={handleEditClick}
        handleCoinClick={handleCoinClick}
      />
      <DailyCheckin />
      <ProfileBody setConfirmPopup={setConfirmPopup} />
      <FooterMenu
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
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
      {confirmPopup.info !== "" && <MintBurnPopup info={confirmPopup?.info} text={confirmPopup?.text} isMint={confirmPopup?.isMint} onClose={() => closeMintBurnPopup()} />}
    </main>
  );
};

export default page;
