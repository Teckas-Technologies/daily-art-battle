import React, { useEffect, useState } from 'react';
import { useFetchArts, ArtData } from '@/hooks/artHooks';
import { useMbWallet } from "@mintbase-js/react";
import Image from 'next/image';
import { useVoting } from '../hooks/useArtVoting';
const UpcomingArtTable: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
  const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
  const { arts, error, loading, fetchMoreArts } = useFetchArts();
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const [page, setPage] = useState(1);
  const [hasnext,setHasNext] = useState(false);
  useEffect(() => {
    if (arts) {
      if (arts.length < 10) { // Change condition to '<' instead of '!='
        setHasNext(true);
      }else{
        setHasNext(false);
      }
      setUpcomingArts(arts);
    }
  }, [arts, hasnext]);
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
  if (loading) return <div className='flex flex-col items-center'>
  <div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div></div>;
  if (error) return <p>Error loading battles: {error}</p>;

  return (
    <div className="battle-table mt-8 pb-10 flex flex-col items-center" style={{ width: '100%', gap: 8 }}>
    <div className='battle-table1 pb-10'>
      <h2 className="text-xl font-bold text-black text-center">Upcoming Arts</h2> 
      <div className='flex justify-between items-center'> 
      <div className="add-art-btn text-center py-1"style={{ marginLeft: 'auto' }}> 
      <button onClick={toggleUploadModal} disabled={!isConnected} className={`px-4 py-2 vote-btn text-white rounded ${!isConnected ? 'cursor-not-allowed' : ''}`}>
        Add Artwork
      </button>
    </div>
      </div>
      <BattleTable artData={upcomingArts} />
      <nav className="flex justify-center flex-wrap gap-4 mt-2">
          <a
            className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${page <= 1 ? 'cursor-not-allowed' : 'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </a>
          <a
            className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${hasnext?'cursor-not-allowed' :'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
            onClick={hasnext ? undefined : handleNext}
          >
            Next
          </a>
        </nav>
    </div>
  </div>
  
  );
};


const BattleTable: React.FC<{ artData: ArtData[] }> = ({ artData }) => {
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
      location.reload();
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
