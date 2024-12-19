"use client";
import CreateCampaign from "@/components/Campaign page/Create Campaign/Createcampaign";
import CampaignPopup from "@/components/Campaign page/CreateCampaign Popup/CampaignPopup";
import Footer from "@/components/Footer/Footer";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { useSession, signIn } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { setAuthToken } from "../../../../utils/authToken";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { WalletConnectPopup } from "@/components/PopUps/WalletConnectPopup";
import { ClaimPopup } from "@/components/PopUps/ClaimPopup";
import usePostNearDrop from "@/hooks/NearDrop";
import { NearContext } from "@/wallet/WalletSelector";
import { NEAR_DROP, SIGNUP } from "@/config/points";
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
  const {
    user,
    userTrigger,
    setUserTrigger,
    newUser,
    setNewUser,
    nearDrop,
    setNearDrop,
  } = useAuth();
  const userDetails = user ?? null;
  console.log("details", userDetails);

  const pathName = usePathname();
  console.log("pathname", pathName);
  useEffect(() => {
    if (pathName === "/campaign/create" && !userDetails) {
      router.push("/campaign");
    }
  }, [pathName, userDetails, router]);
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
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
        setWalletMismatchPopup={setWalletMismatchPopup}
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
