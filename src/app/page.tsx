// pages/index.tsx
"use client"
import type { NextPage } from 'next';
import { useState } from 'react';
import ArtUploadForm from '@/components/ArtUpload/ArtUploadForm';
import Footer from '@/components/Footer/Footer';
import { GFX_CAMPAIGNID } from '@/config/constants';
import { Header } from '@/components/Header/Header';
import PreviousArtHeader from '@/components/ArtBattle/PreviousArts/PreviousArtHeader';
import { Battle } from '@/components/ArtBattle/Battle/Battle';
import UpcomingHeader from '@/components/ArtBattle/UpcomingArts/UpcomingHeader';
import { UpcomingGrid } from '@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid';
import { PreviousGrid } from '@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid';

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

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
      {showUploadModal && <ArtUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <PreviousArtHeader />
      <PreviousGrid fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} />
      <Footer />
    </main>
  );
};

export default Home;