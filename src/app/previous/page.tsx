"use client";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import { GFX_CAMPAIGNID } from "@/config/constants";
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
    </div>
  );
};

export default page;
