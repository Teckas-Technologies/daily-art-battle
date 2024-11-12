// pages/index.tsx
"use client"
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import ArtUploadForm from '@/components/ArtUpload/ArtUploadForm';
import Footer from '@/components/Footer/Footer';
import { GFX_CAMPAIGNID, ADMIN_GMAIL } from '@/config/constants';
import { Header } from '@/components/Header/Header';
import PreviousArtHeader from '@/components/ArtBattle/PreviousArts/PreviousArtHeader';
import { Battle } from '@/components/ArtBattle/Battle/Battle';
import UpcomingHeader from '@/components/ArtBattle/UpcomingArts/UpcomingHeader';
import { UpcomingGrid } from '@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid';
import { PreviousGrid } from '@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid';
import { signOut, useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
// import { setAuthToken } from '../../utils/authToken';
import { FooterMenu } from '@/components/FooterMenu/FooterMenu';
import { useSendWalletData } from "@/hooks/saveUserHook";
import { useMbWallet } from "@mintbase-js/react";
import { useAuth } from '@/contexts/AuthContext';
import InlineSVG from 'react-inlinesvg';
import { MobileNav } from '@/components/MobileNav/MobileNav';
import { SignInPopup } from '@/components/PopUps/SignInPopup';
import Toast from '@/components/Toast';

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // const { data: session, status } = useSession();
  // const { sendWalletData } = useSendWalletData();
  // const { activeAccountId, isConnected } = useMbWallet();
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000)
    }
  }, [toast])

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
  // useEffect(() => {
  //   const handleWalletData = async () => {
  //     if (session && session.user) {
  //       const idToken = session.idToken as string;
  //       console.log("ID Token:", idToken);

  //       const walletAddress = activeAccountId;
  //       if (!walletAddress) {
  //         console.warn("No wallet address available.");
  //         return;
  //       }

  //       console.log("Wallet Address:", walletAddress);

  //       try {
  //         const user = await sendWalletData(walletAddress);
  //         if(user !== null) {
  //           console.log("USER:", user)
  //           setUser(user)
  //         }
  //       } catch (err) {
  //         console.error("Failed to send wallet data:", err);
  //       }
  //     } else {
  //       console.warn("Session or user information is missing.");
  //     }
  //   };

  //   handleWalletData();
  // }, [session, activeAccountId]);

  console.log(`${toast}, ${successToast}, ${toastMessage}`)

  return (
    <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <Header openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <Battle campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} fontColor={""} welcomeText={""} themeTitle={""} />
      <UpcomingGrid fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} adminEmail={ADMIN_GMAIL} />
      {showUploadModal && <ArtUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} setSignToast={setSignToast} setErrMsg={setErrMsg} setToast={setToast} setSuccessToast={setSuccessToast} setToastMessage={setToastMessage} />}
      <FooterMenu fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      {signToast && <SignInPopup text={errMsg} onClose={() => setSignToast(false)} />}
      {toast && toastMessage && <div className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden" style={{ zIndex: 55 }}>
        <div className="relative w-full h-full">
          <Toast
            success={successToast === "yes" ? true : false}
            message={toastMessage}
            onClose={() => { setToast(false); setToastMessage(""); setSuccessToast(""); }}
          />
        </div>
      </div>
      }
    </main>
  );
};

export default Home;