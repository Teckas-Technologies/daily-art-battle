// pages/index.tsx
"use client"
import type { NextPage } from 'next';
import { useState } from 'react';
import { NearWalletConnector } from '../components/NearWalletConnector';
import { ArtworkUploadForm } from '../components/ArtworkUploadForm';
import ArtBattle from '../components/ArtBattle';
import UpcomingBattlesTable from '../components/UpcomingBattlesTable';
import PreviousArtTable from '@/components/PreviousBattlesTable';
import Footer from '@/components/Footer';
const Home: NextPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  return (
    <main className="flex flex-col justify-center" style={{ width: '100vw',  backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <NearWalletConnector />
      {showUploadModal && <ArtworkUploadForm campaignId={"1234"} onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <ArtBattle campaignId={"1234"} toggleUploadModal={toggleUploadModal} />
      <UpcomingBattlesTable campaignId={"1234"} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <PreviousArtTable campaignId={"1234"}toggleUploadModal={toggleUploadModal}/>
      <Footer/>
    </main>
  );
};

export default Home;
