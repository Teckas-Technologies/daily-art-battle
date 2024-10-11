// pages/index.tsx
"use client"
import type { NextPage } from 'next';
import { useState } from 'react';
import { ArtworkUploadForm } from '../components/ArtworkUploadForm';
import PreviousArtTable from '@/components/PreviousBattlesTable';
import Footer from '@/components/Footer';
import { GFX_CAMPAIGNID } from '@/config/constants';
import { Header } from '@/components/Header/Header';
import PreviousArtHeader from '@/components/ArtBattle/PreviousArts/PreviousArtHeader';
import { Battle } from '@/components/ArtBattle/Battle/Battle';
import UpcomingHeader from '@/components/ArtBattle/UpcomingArts/UpcomingHeader';
import { UpcomingGrid } from '@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid';
import { signIn } from 'next-auth/react';

const Home = () => {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // useEffect(() => {
    // Redirect to login if not authenticated
  //   if (status === "unauthenticated") {
  //       // Trigger login with Azure B2C provider
  //       signIn('azure-ad-b2c',{ callbackUrl: '/' });
  //   }
  //   console.log(status);
  //   console.log(session);
  // }, [status, router]);

  // // Show loading state while session status is being determined
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  return (
    <main className="flex flex-col w-full justify-center overflow-x-hidden" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
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
      <Battle campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} fontColor={""} welcomeText={""} themeTitle={""} />
      <UpcomingHeader fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <UpcomingGrid fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      {showUploadModal && <ArtworkUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <PreviousArtHeader />
      <PreviousArtTable   fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal}/>
      <Footer/>
    </main>
  );
};

export default Home;
