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

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // const { data: session, status } = useSession();
  // const { sendWalletData } = useSendWalletData();
  // const { activeAccountId, isConnected } = useMbWallet();
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [openNav, setOpenNav] = useState(false);
  // const [user, setUser] = useState<any>();

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

  return (
    <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <Header openNav={openNav} setOpenNav={setOpenNav} />
      <Battle campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} fontColor={""} welcomeText={""} themeTitle={""} />
      <UpcomingGrid fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} adminEmail={ADMIN_GMAIL} />
      {showUploadModal && <ArtUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <FooterMenu />
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} />
    </main>
  );
};

export default Home;