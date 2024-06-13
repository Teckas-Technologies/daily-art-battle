"use client"
import React, { useState, useEffect } from 'react';
import { useFetchArts, ArtData } from '../hooks/artHooks';
import { useMbWallet } from "@mintbase-js/react";
import Image from 'next/image';
import { useVoting } from '../hooks/useArtVoting';

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
    await  fetchMoreArts(page);
   };
   initializeData();
   
  }, [page, refresh, uploadSuccess]);

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
      <div className='flex justify-between items-center'> 
      <div className="add-art-btn text-center py-1 ml-auto  px-10" style={{paddingRight:'110px'}}> 
      <button onClick={toggleUploadModal} disabled={!isConnected} className={`px-4 md:mr-5 py-2 vote-btn text-white rounded ${!isConnected ? 'cursor-not-allowed' : ''}`}>
        Add Artwork
      </button>
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
   
    <div className="overflow-x-auto">
    <table className="min-w-full mt-4">
      <thead>
        <tr className="bg-white">
          <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left text-center" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Arts</th>
          {/* <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Artist Name</th> */}
          <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, color: 'black' }}>UpVotes</th>
          <th className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-left" style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, color: 'black' }}></th>
        </tr>
      </thead>
      <tbody>
        {artData.slice(-10).map((art, index) => (
          <tr key={index} className="border-b bg-white">
         <td className="" style={{ color: 'black' }}>
          <div className="flex flex-col items-center px-2 sm:px-6 py-2 text-xs sm:text-sm font-medium">
            <div className="flex-none md:shrink-0">
              <Image
                src={art.colouredArt}
                alt="Art A"
                width={100}
                height={100}
                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-full"
                unoptimized
              />
            
            </div>
            <p className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-center">{art.arttitle} by {art.artistId}</p>
          </div>
        </td>

            {/* <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-small break-all" style={{ color: 'black' }}>
              {art.artistId}
            </td> */}
            <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-small" style={{ color: 'black' }}>
              {art.upVotes}
            </td>
            <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-small" style={{ color: 'black', backgroundColor: 'none' }}>
              <button onClick={() => onVote(art._id)} className="w-full sm:w-auto px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded text-xs sm:text-sm">
                Vote
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
    );
    
  
}

export default UpcomingArtTable;
