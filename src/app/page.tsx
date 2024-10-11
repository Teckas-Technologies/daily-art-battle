"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Inter } from "next/font/google";
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import ArtworkUploadForm from '../components/ArtworkUploadForm';
import UpcomingBattlesTable from '../components/UpcomingBattlesTable';
import PreviousArtTable from '@/components/PreviousBattlesTable';
import Footer from '@/components/Footer';
import { GFX_CAMPAIGNID } from '@/config/constants';
import { signIn } from 'next-auth/react';
const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
        // Trigger login with Azure B2C provider
        signIn('azure-ad-b2c',{ callbackUrl: '/' });
    }
    console.log(status);
    console.log(session);
  }, [status, router]);

  // Show loading state while session status is being determined
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className={`flex flex-col justify-center ${inter.className}`} style={{ width: '100vw', backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <video autoPlay muted loop id="background-video" style={{
        position: 'fixed',
        right: 0,
        bottom: 0,
        objectFit: 'cover',
        minWidth: '100%',
        minHeight: '100%',
        zIndex: -1,
        filter: 'blur(5px) brightness(50%)'
      }}>
        <source src="images/back.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Header />
      <Hero campaignId={GFX_CAMPAIGNID} toggleUploadModal={() => setShowUploadModal(!showUploadModal)} fontColor={""} welcomeText={""} themeTitle={""} />
      {showUploadModal && <ArtworkUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <UpcomingBattlesTable fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={() => setShowUploadModal(!showUploadModal)} uploadSuccess={uploadSuccess} />
      <PreviousArtTable fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={() => setShowUploadModal(!showUploadModal)} />
      <Footer />
    </main>
  );
};

export default Home;
