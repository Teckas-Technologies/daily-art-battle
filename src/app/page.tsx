// pages/index.tsx
"use client"
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import ArtUploadForm from '@/components/ArtUpload/ArtUploadForm';
import { GFX_CAMPAIGNID, ADMIN_GMAIL } from '@/config/constants';
import { Header } from '@/components/Header/Header';
import { Battle } from '@/components/ArtBattle/Battle/Battle';
import { UpcomingGrid } from '@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid';
import { FooterMenu } from '@/components/FooterMenu/FooterMenu';
import { MobileNav } from '@/components/MobileNav/MobileNav';
import { SignInPopup } from '@/components/PopUps/SignInPopup';
import Toast from '@/components/Toast';
import Script from 'next/script';
import usetelegramDrop from '@/hooks/telegramHooks';
import { useFetchTodayBattle } from '@/hooks/battleHooks';
import Loader from '@/components/ArtBattle/Loader/Loader';

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId,setUserId] = useState<Number>();
  const { data: session, status } = useSession();
  const {telegramDrop} = usetelegramDrop();
  const { todayBattle, loading, battle, error, fetchTodayBattle } = useFetchTodayBattle();

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
  }, [toast]);

  useEffect(() => {

    if (typeof Telegram !== "undefined" && Telegram.WebApp) {
      Telegram.WebApp.ready();
      const user = Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        console.log(user.id);
        telegram();
      }
    }
  }, [session]);

  const telegram = async ()=>{
    await telegramDrop(userId)
  }
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
    const fetchBattle = async () => {
      await fetchTodayBattle(GFX_CAMPAIGNID);
    };

    const timeoutId = setTimeout(() => {
      fetchBattle();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [GFX_CAMPAIGNID]);

  if (loading) {
    return <div className='w-full h-[100vh] flex justify-center items-center bg-black'>
      <Loader md="22" sm="15" />{" "}
    </div>
  }

  return (
    <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <Header openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} setSignToast={setSignToast} setErrMsg={setErrMsg} />
      <Battle campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} todayBattle={todayBattle} loading={loading} error={error} fontColor={""} welcomeText={""} themeTitle={""} />
      <UpcomingGrid fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} adminEmail={ADMIN_GMAIL} showUploadModal={showUploadModal} />
      {showUploadModal && <ArtUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} setSignToast={setSignToast} setErrMsg={setErrMsg} setToast={setToast} setSuccessToast={setSuccessToast} setToastMessage={setToastMessage} />}
      <FooterMenu fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} setSignToast={setSignToast} setErrMsg={setErrMsg} />
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} setSignToast={setSignToast} setErrMsg={setErrMsg} />
      {signToast && <SignInPopup text={errMsg} onClose={() => setSignToast(false)} />}
      {toast && toastMessage && (
        <div className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden" style={{ zIndex: 55 }}>
          <div className="relative w-full h-full">
            <Toast
              success={successToast === "yes"}
              message={toastMessage}
              onClose={() => { setToast(false); setToastMessage(""); setSuccessToast(""); }}
            />
          </div>
        </div>
      </div>
      }
       <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      )}
    </main>
  );
};

export default Home;