"use client"
import React, { useState, useEffect } from 'react';
import { useFetchArts, ArtData } from '../hooks/artHooks';
import { useMbWallet } from "@mintbase-js/react";
import Image from 'next/image';
import { useVoting } from '../hooks/useArtVoting';
import { Button } from './ui/button';


const UpcomingArtTable: React.FC<{ toggleUploadModal: () => void, uploadSuccess: boolean }> = ({ toggleUploadModal, uploadSuccess }) => {
  const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
  const [refresh, setRefresh] = useState(false); 
  const { arts, error, fetchMoreArts } = useFetchArts();
  const { isConnected } = useMbWallet();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (arts) {
      setUpcomingArts(arts);
    }
  }, [arts]);

  useEffect(() => {
    const initializeData = async () => {
      fetchMoreArts(page);
   };
   const timeoutId = setTimeout(initializeData, 1000); 

    return () => clearTimeout(timeoutId);
  }, [page, refresh, uploadSuccess, fetchMoreArts]);

  const [hasnext,setHasNext] = useState(false);

  useEffect(() => {
    if (arts) {
      setHasNext(arts.length >= 10); 
      }
      setUpcomingArts(arts);
  }, [arts]);

  const handleNext = () => {
    setPage(prevPage => prevPage + 1);
    fetchMoreArts(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      fetchMoreArts(page - 1);
    }
  };
 return (
    <div className="battle-table mt-8 pb-10 flex flex-col items-center" style={{ width: '100%', gap: 8 }}>
    <div className='battle-table1 pb-10'>
      <h2 className="text-xl font-bold text-black text-center">Upcoming Arts</h2> 
      <p  className='px-4 text-center text-black font-mono mt-5 sm:font-thin md:text-lg'>Upvote your favorite artworks to influence what will be up for battle next. Think you’ve got what it takes? Upload your own masterpiece and join the competition!      </p>
      <div className='flex justify-between items-center'> 
      <div className="mt-3 add-art-btn flex-auto text-center py-1  justify-center"> 
      <Button onClick={toggleUploadModal} disabled={!isConnected} className={`px-4 md:mr-5 py-2 vote-btn text-white rounded ${!isConnected ? 'cursor-not-allowed' : ''}`}>
        Add Artwork
      </Button>
    </div>
      </div>
      <BattleTable artData={upcomingArts} setRefresh={setRefresh}/>
      <nav className="flex justify-center flex-wrap gap-4 mt-2">
          <a
            className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${page <= 1 ? 'cursor-not-allowed' : 'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </a>
          <a
            className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${hasnext? 'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white':'cursor-not-allowed'}`}
            onClick={hasnext ? handleNext : undefined}
          >
            Next
          </a>
        </nav>
    </div>
 
  </div>
  
  );
};



const BattleTable: React.FC<{ artData: ArtData[] ,setRefresh: React.Dispatch<React.SetStateAction<boolean>>}> = ({ artData,setRefresh }) => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const {  votes,  fetchVotes,  submitVote,} = useVoting();
  const [success,setSuccess] = useState(false);

  const onVote = async (id: string) => {
    if (!isConnected || !activeAccountId) {
      await connect();
      return;
    }
    if(!id) {
      alert("art  not loaded!");
      return;
    }
    const success = await submitVote({
      participantId: activeAccountId,
      artId: id,
    });
    if (success) {
      setSuccess(true);
      alert('Vote submitted successfully!');
      setRefresh(prev => !prev); 
    } else {
      alert('Failed to submit vote. Maybe you already voted!');
    }
  };

  return (
<div className="mx-8 overflow-hidden battle-table container my-12 mx-auto px-4 md:px-12" style={{ zIndex: '-1' }}>
<div className="battle-table grid grid-cols-3 gap-4 justify-center overflow-hidden">
  {artData.slice(-10).map((art, index) => (
    <div key={index} className="flex justify-center overflow-hidden">
      <div className="w-full flex flex-col h-full px-2 p-1 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-gray-200 shadow-md overflow-hidden">
        <div className="flex justify-center items-center flex-grow">
          <img
            src={art.colouredArt}
            alt="Art A"
            className="w-full h-auto object-cover"
            loading="lazy"
            style={{
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
        </div>
        {/* <p className="mt-2 py-2 text-gray-900 text-xs font-small break-all text-center">{art.arttitle} by {art.artistId}</p> */}
        <div className="flex justify-between items-center mt-auto p-2">
          <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
            <svg className="h-5 w-5 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.625.22l7 5a1 1 0 01.375 1.375l-1.875 3.75a1 1 0 01-.625.625l-5 1a1 1 0 01-1.125-.375l-3.75-5a1 1 0 01.625-1.625l.75-.125 1.125-.25a2 2 0 011.25.5l3.75 5A2 2 0 0112 16h-1v-3a1 1 0 10-2 0v3H8a2 2 0 01-1.625-.875l-3.75-5a2 2 0 01.5-3.25l1.125-.25.75-.125A1 1 0 016 8.5l-1.875-3.75a1 1 0 01.375-1.375l7-5A1 1 0 0110 3zm0 1.75L4.625 8.5 6 10l4-2 4 2 1.375-1.75L10 4.75z" clipRule="evenodd" />
            </svg>
            <span>{`${art.upVotes}`}</span>
          </span>
          <Button
            onClick={() => onVote(art._id)}
            className="text-xs h-15 text-white px-2 py-1 sm:px-3 sm:py-1 sm:text-sm md:px-5 md:py-2 md:text-base rounded-md"
          >
            Vote
          </Button>
        </div>
      </div>
    </div>
  ))}
</div>

</div>

  

  )}
export default UpcomingArtTable;
