// pages/index.tsx
"use client"
import type { NextPage } from 'next';
import { useState } from 'react';
import { NearWalletConnector } from '../components/NearWalletConnector';
import { ArtworkUploadForm } from '../components/ArtworkUploadForm';
import ArtBattle from '../components/ArtBattle';
import UpcomingHeader from '../components/Upcoming Arts/UpcomingHeader';
import PreviousArtTable from '@/components/PreviousBattlesTable';
import Footer from '../components/Footer/Footer';
import { GFX_CAMPAIGNID } from '@/config/constants';
import PreviousArtHeader from '@/components/PreviousArtHeader/PreviousArtHeader';

const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  return (
    <main className="flex flex-col justify-center" style={{ width: '100vw',  backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
     {/* <video autoPlay muted loop id="background-video" style={{ 
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
</video> */}
      <NearWalletConnector />
      {showUploadModal && <ArtworkUploadForm campaignId={GFX_CAMPAIGNID} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <ArtBattle  
        fontColor={""}
        welcomeText={""}
        themeTitle={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} />
      <UpcomingHeader  fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <PreviousArtTable   fontColor={""} campaignId = {GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal}/>
      <PreviousArtHeader/>
      <Footer/>
    </main>
  );
};

export default Home;