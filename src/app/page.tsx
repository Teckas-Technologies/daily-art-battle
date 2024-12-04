// pages/index.tsx
"use client";
import type { NextPage } from "next";
import { useState, useEffect, useContext } from "react";
import ArtUploadForm from "@/components/ArtUpload/ArtUploadForm";
import { GFX_CAMPAIGNID, ADMIN_GMAIL } from "@/config/constants";
import { Header } from "@/components/Header/Header";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import { UpcomingGrid } from "@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import { SignInPopup } from "@/components/PopUps/SignInPopup";
import Toast from "@/components/Toast";
import { useFetchTodayBattle } from "@/hooks/battleHooks";
import Loader from "@/components/ArtBattle/Loader/Loader";
import { WalletConnectPopup } from "@/components/PopUps/WalletConnectPopup";
import PreviousPath from "@/components/ArtBattle/PreviousArts/PreviousPath/PreviousPath";
import { NearContext } from "@/wallet/WalletSelector";
import { useAuth } from "@/contexts/AuthContext";
import usePostNearDrop from "@/hooks/NearDrop";
import { ClaimPopup } from "@/components/PopUps/ClaimPopup";
import Script from "next/script";
import { signIn, useSession } from "next-auth/react";
import usetelegramDrop from "@/hooks/telegramHook";
// import Script from "next/script";
import { setAuthToken } from "../../utils/authToken";
// import { useAuth } from "@/contexts/AuthContext";

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [teleConnect, setTeleConnect] = useState(false);
  // const { user, signInUser, signOutUser,userTrigger,setUserTrigger } = useAuth();
  const [successToast, setSuccessToast] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { todayBattle, loading, battle, error, fetchTodayBattle } =
    useFetchTodayBattle();
  const { wallet, signedAccountId } = useContext(NearContext);
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
  const [userId, setUserId] = useState<Number>();
  const { data: session, status } = useSession();
  const { telegramDrop } = usetelegramDrop();

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
  }, [toast]);

  useEffect(() => {
    const fetchBattle = async () => {
      await fetchTodayBattle(GFX_CAMPAIGNID);
    };

    const timeoutId = setTimeout(() => {
      fetchBattle();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [GFX_CAMPAIGNID]);
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
  useEffect(() => {
    if (typeof Telegram !== "undefined" && Telegram.WebApp) {
      Telegram.WebApp.ready();
      const users = Telegram.WebApp.initDataUnsafe?.user;
      // alert(`before user ${users?.id}` );
      if (users && user) {
        // alert(`after user ${users?.id}` );
        setUserId(users.id);
        console.log(users.id);
        telegram(users.id);
      }
    }
  }, [user]);

  const telegram = async (user_id: any) => {
    setAuthToken(session?.idToken as string);
    const res = await telegramDrop(user_id);
    if (res) {
      setTeleConnect(true);
    }

    setUserTrigger(!userTrigger);
    // alert(user_id);
  };

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center bg-black">
        <Loader md="22" sm="15" />{" "}
      </div>
    );
  }
  console.log("New User >>>>>>>>>>>", newUser);
  return (
    <main
      className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]"
      style={{
        backgroundPosition: "top",
        backgroundSize: "cover",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
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
      <Battle
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        todayBattle={todayBattle}
        loading={loading}
        error={error}
        fontColor={""}
        welcomeText={""}
        themeTitle={""}
      />
      <PreviousPath />
      <UpcomingGrid
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        adminEmail={ADMIN_GMAIL}
        showUploadModal={showUploadModal}
      />
      {showUploadModal && (
        <ArtUploadForm
          campaignId={GFX_CAMPAIGNID}
          onClose={() => setShowUploadModal(false)}
          onSuccessUpload={() => setUploadSuccess(true)}
          setSignToast={setSignToast}
          setErrMsg={setErrMsg}
          setToast={setToast}
          setSuccessToast={setSuccessToast}
          setToastMessage={setToastMessage}
        />
      )}
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
      {newUser && (
        <ClaimPopup
          msg="🎉 Welcome! You've been credited with 1000 GFX."
          onClose={() => setNewUser(false)}
        />
      )}
      {nearDrop && (
        <ClaimPopup
          msg="Reward unlocked! You've earned 10 NearDrop points!"
          onClose={() => setNearDrop(false)}
        />
      )}
      {teleConnect && (
        <ClaimPopup
          msg="Success! You've claimed your Telegram drop! 🎉"
          onClose={() => setTeleConnect(false)}
        />
      )}
      
      {toast && toastMessage && (
        <div
          className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden"
          style={{ zIndex: 55 }}
        >
          <div className="relative w-full h-full">
            <Toast
              success={successToast === "yes"}
              message={toastMessage}
              onClose={() => {
                setToast(false);
                setToastMessage("");
                setSuccessToast("");
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
