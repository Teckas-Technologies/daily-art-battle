// pages/index.tsx
"use client";
import type { NextPage } from 'next';
import { useState } from 'react';
import { NearWalletConnector } from '../components/NearWalletConnector';
import { ArtworkUploadForm } from '../components/ArtworkUploadForm';
import { LeaderboardModal } from '../components/LeaderboardModal';
import ArtBattle from '../components/ArtBattle';
import UpcomingBattlesTable from '../components/UpcomingBattlesTable';
import PreviousArtTable from '@/components/PreviousBattlesTable';

const Home: NextPage = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

    const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
    const toggleLeaderboardModal = () => setShowLeaderboardModal(!showLeaderboardModal);

    return ( 
        <main className="flex flex-col justify-center" style={{width: '100vw', backgroundImage: 'url(\'images/dark pattern7.jpg\')', backgroundPosition:'top', backgroundSize:'cover', overflow:'hidden'}}>
            <NearWalletConnector />

            
            {showUploadModal && <ArtworkUploadForm onClose={toggleUploadModal} />}
            <ArtBattle toggleUploadModal={toggleUploadModal} />
            <UpcomingBattlesTable toggleUploadModal={toggleUploadModal}/>
            <PreviousArtTable toggleUploadModal={toggleLeaderboardModal}/>
        </main>
    );
};

export default Home;
