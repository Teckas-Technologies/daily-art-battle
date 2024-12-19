"use client";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import { ClaimPopup } from "@/components/PopUps/ClaimPopup";
import { WalletConnectPopup } from "@/components/PopUps/WalletConnectPopup";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { NEAR_DROP, SIGNUP } from "@/config/points";
import { useAuth } from "@/contexts/AuthContext";
import useCampaigns from "@/hooks/CampaignHook";
import React, { useEffect, useState } from "react";

const page = ({ params }: { params: { campaign: string } }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [editCampaign, setEditCampaign] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
  const {
    fetchCampaignByTitle,
    campaignStatus,
    campaign,
    isLoading,
    isError,
    participants,
  } = useCampaigns();
  useEffect(() => {
    console.log("Fetching campaign with the following details:");
    console.log("Campaign:", params.campaign);

    fetchCampaignByTitle(params.campaign);
  }, [params.campaign, editCampaign]);
  const {
    user,
    userTrigger,
    setUserTrigger,
    newUser,
    setNewUser,
    nearDrop,
    setNearDrop,
  } = useAuth();
  return (
    <div className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]">
      <Header
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
        setWalletMismatchPopup={setWalletMismatchPopup}
      />
      <PreviousArtHeader />
      <PreviousGrid
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
      />
      <FooterMenu
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
      />
      <MobileNav
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
      />
      {walltMisMatchPopup && (
        <WalletConnectPopup onClose={() => setWalletMismatchPopup(false)} />
      )}
      {newUser && (
          <ClaimPopup
          msg={`🎉 Welcome to the World of GFXvs!
As a token of our excitement, we’ve credited your account with ${SIGNUP} GFX Coins! Use them wisely to kickstart your NFT journey and explore exclusive rewards. 🚀`}
          onClose={() => setNewUser(false)}
          toggleUploadModal={toggleUploadModal}
        />
      )}
      {nearDrop && (
         <ClaimPopup
         msg={`🎉 Legendary Reward Unlocked!
Your account's legacy has earned you exclusive NearDrop Point your gateway to rare NFTs and exciting perks. 🌟
The longer your account's journey, the more epic the rewards! Keep collecting, keep winning! 🚀`}
         onClose={() => setNearDrop(false)}
         toggleUploadModal={toggleUploadModal}
       />
      )}
    </div>
  );
};

export default page;
