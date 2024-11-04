"use client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import ArtUploadForm from "@/components/ArtUpload/ArtUploadForm";
import Footer from "@/components/Footer/Footer";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { Header } from "@/components/Header/Header";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import UpcomingHeader from "@/components/ArtBattle/UpcomingArts/UpcomingHeader";
import { UpcomingGrid } from "@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { signOut, useSession, signIn } from "next-auth/react";
import { useSendWalletData } from "@/hooks/saveUserHook";
import { useMbWallet } from "@mintbase-js/react";

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { data: session, status } = useSession();
  const { sendWalletData } = useSendWalletData();
  const { activeAccountId, isConnected } = useMbWallet();
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("azure-ad-b2c", { callbackUrl: "/" });
    }

    console.log("status", status);
    console.log("session", session);
  }, [status, session]);
  useEffect(() => {
    const handleWalletData = async () => {
      if (session && session.user) {
        const idToken = session.idToken as string;
        console.log("ID Token:", idToken);

        const walletAddress = activeAccountId;
        if (!walletAddress) {
          console.warn("No wallet address available.");
          return;
        }

        console.log("Wallet Address:", walletAddress);

        try {
          await sendWalletData(idToken, walletAddress);
        } catch (err) {
          console.error("Failed to send wallet data:", err);
        }
      } else {
        console.warn("Session or user information is missing.");
      }
    };

    handleWalletData();
  }, [session, activeAccountId]);

  return (
    <main
      className="flex flex-col w-full justify-center overflow-x-hidden"
      style={{
        backgroundPosition: "top",
        backgroundSize: "cover",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <video
        autoPlay
        muted
        loop
        id="background-video"
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          objectFit: "cover",
          minWidth: "100%",
          minHeight: "100%",
          zIndex: -1,
          filter: "blur(5px) brightness(50%)",
        }}
      >
        <source src="images/back.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Header />
      {/* <Battle
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        fontColor={''}
        welcomeText={''}
        themeTitle={''}
      /> 
      <UpcomingHeader
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
      <UpcomingGrid
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
      {showUploadModal && (
        <ArtUploadForm
          campaignId={GFX_CAMPAIGNID}
          onClose={() => setShowUploadModal(false)}
          onSuccessUpload={() => setUploadSuccess(true)}
        />
      )}
      <PreviousArtHeader />
      <PreviousGrid
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
      /> */}
      <Footer />
    </main>
  );
};

export default Home;