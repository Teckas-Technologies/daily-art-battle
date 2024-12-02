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
  const { postNearDrop, response } = usePostNearDrop();
  const { wallet, signedAccountId } = useContext(NearContext);
  useEffect(() => {
    const triggerNearDrop = async () => {
      if (signedAccountId && userDetails?.user?.isNearDropClaimed === false) {
        try {
          const payload = { nearAddress: signedAccountId };
          await postNearDrop(payload);
          setUserTrigger(!userTrigger);
          setNearDrop(true);
          console.log("Near drop triggered successfully.");
        } catch (error) {
          console.error("Error triggering near drop:", error);
        }
      }
    };

    triggerNearDrop();
  }, [signedAccountId, userDetails, userTrigger]);
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
      {nearDrop && (
        <ClaimPopup
          msg="Reward unlocked! You've earned 10 NearDrop points!"
          onClose={() => setNearDrop(false)}
        />
      )}
    </div>
  );
};

export default page;
