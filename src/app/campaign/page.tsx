"use client";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import CampaignBanner from "@/components/Campaign page/Campaigns/Campaign";
import Footer from "@/components/Footer/Footer";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { useSession, signIn } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { setAuthToken } from "../../../utils/authToken";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import NoPage from "@/components/404 Page/NoPage";
import { SignInPopup } from "@/components/PopUps/SignInPopup";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { WalletConnectPopup } from "@/components/PopUps/WalletConnectPopup";
import { ClaimPopup } from "@/components/PopUps/ClaimPopup";
import { NearContext } from "@/wallet/WalletSelector";
import usePostNearDrop from "@/hooks/NearDrop";
import { NEAR_DROP, SIGNUP } from "@/config/points";
const page = () => {
  const { data: session, status } = useSession();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
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
  let userDetails = user;
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
  // const { postNearDrop, isLoading, response } = usePostNearDrop();
  const { wallet, signedAccountId } = useContext(NearContext);
  // useEffect(() => {
  //   const triggerNearDrop = async () => {
  //     if (signedAccountId && userDetails?.user?.isNearDropClaimed === false) {
  //       try {
  //         const payload = { nearAddress: signedAccountId };
  //         await postNearDrop(payload);
  //         setUserTrigger(!userTrigger);
  //         setNearDrop(true);
  //         console.log("Near drop triggered successfully.");
  //       } catch (error) {
  //         console.error("Error triggering near drop:", error);
  //       }
  //     }
  //   };

  //   triggerNearDrop();
  // }, [signedAccountId, userDetails, userTrigger]);

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

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000000" }}>
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
      <CampaignBanner
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
        setInfoMsg={setInfoMsg}
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
      {signToast && (
        <SignInPopup
          text={errMsg}
          infoMsg={infoMsg}
          onClose={() => setSignToast(false)}
        />
      )}
       {walltMisMatchPopup && (
        <WalletConnectPopup onClose={() => setWalletMismatchPopup(false)} />
      )}
    </div>
    // <div style={{ width: "100%", minHeight: "100vh", background: "#000000" }}>
    // <NoPage/>
    // </div>
  );
};

export default page;
