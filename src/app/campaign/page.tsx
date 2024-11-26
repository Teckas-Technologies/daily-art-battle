"use client";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import CampaignBanner from "@/components/Campaign page/Campaigns/Campaign";
import Footer from "@/components/Footer/Footer";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { setAuthToken } from "../../../utils/authToken";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import NoPage from "@/components/404 Page/NoPage";
import { SignInPopup } from "@/components/PopUps/SignInPopup";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { WalletConnectPopup } from "@/components/PopUps/WalletConnectPopup";
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

  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);

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
