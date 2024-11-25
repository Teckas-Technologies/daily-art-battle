"use client";
import CreateCampaign from "@/components/Campaign page/Create Campaign/Createcampaign";
import CampaignPopup from "@/components/Campaign page/CreateCampaign Popup/CampaignPopup";
import Footer from "@/components/Footer/Footer";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { useSession, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { setAuthToken } from "../../../../utils/authToken";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: string;
}
const page = () => {
  const { data: session, status } = useSession();
  const [openNav, setOpenNav] = useState(false);
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     // Redirect to login if not authenticated
  //     signIn('azure-ad-b2c', { callbackUrl: '/' });
  //   } else if (status === 'authenticated' && session) {
  //     // Set the idToken for all API requests
  //     setAuthToken(session?.idToken || "");
  //     console.log('Token set for API requests', session);
  //   }
  // }, [status, session]);
  const idToken = session?.idToken || "";
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const toggleCampaignModal = () => setShowCampaignModal(!showCampaignModal);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [signToast, setSignToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const userDetails = user ?? null;
  console.log("details", userDetails);

  const pathName = usePathname();
  console.log("pathname", pathName);
  useEffect(() => {
    if (pathName === "/campaign/create" && userDetails === null) {
      // Redirect only if userDetails is confirmed to be null (not loading)
      router.push("/campaign");
    }
  }, [pathName, userDetails, router]);

  return (
    <div style={{ backgroundColor: "#000000" }}>
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
      <CreateCampaign
        toggleCampaignModal={toggleCampaignModal}
        idToken={idToken}
      />
      {/* {showCampaignModal && (
        <CampaignPopup onClose={() => setShowCampaignModal(false)} />
      )} */}
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
