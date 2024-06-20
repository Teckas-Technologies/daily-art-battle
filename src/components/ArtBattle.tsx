"use client";
import React, { useEffect, useState } from 'react';
import ArtPiece from './ArtPiece';
import { useMbWallet } from "@mintbase-js/react";
import { useFetchTodayBattle } from '@/hooks/battleHooks';
import { useVoting } from '../hooks/useVoting';
interface Artwork {
  id: string;
  imageUrl: string;
  name: string;
  title:string;
  artistId:string;
}

const ArtBattle: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { todayBattle, loading, error,fetchTodayBattle } = useFetchTodayBattle();
  const [artA, setArtA] = useState<Artwork>({ id: 'ArtA', name: 'Art A', imageUrl: '',title:'',artistId:'' });
  const [artB, setArtB] = useState<Artwork>({ id: 'ArtB', name: 'Art B', imageUrl: '' ,title:'',artistId:''});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [battleId, setBattleId] = useState<string>();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [votedFor ,setVoterFor] = useState("");
  const [refresh, setRefresh] = useState(false); 
  useEffect( () => {
    const fetchData = async () => {
      if (todayBattle && activeAccountId) {
        const res = await fetchVotes(activeAccountId, todayBattle._id);
        if (res) {
          setVoterFor(res.votedFor);
          setSuccess(true);
        }
      }
    };
       fetchData();
       fetchTodayBattle();
   
  }, [todayBattle, activeAccountId, fetchVotes, refresh]);

  useEffect(() => {
    if (todayBattle) {
      const endTime = new Date(todayBattle.endTime).getTime();
      const now = new Date().getTime();
      const remaining = endTime - now;
      setTimeRemaining(remaining > 0 ? remaining : null);

      const timer = setInterval(() => {
        const remainingTime = endTime - new Date().getTime();
        setTimeRemaining(remainingTime > 0 ? remainingTime : null);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [todayBattle]);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  

  useEffect(() => {
    if (todayBattle) {
      setArtA({ id: 'Art A', name: 'Art A', imageUrl: todayBattle.artAcolouredArt,title:todayBattle.artAtitle ,artistId:todayBattle.artAartistId});
      setArtB({ id: 'Art B', name: 'Art B', imageUrl: todayBattle.artBcolouredArt,title:todayBattle.artBtitle ,artistId:todayBattle.artBartistId });
      setBattleId(todayBattle._id);
    }
  }, [todayBattle]);

  const onVote = async (id: string) => {
    if (!isConnected || !activeAccountId) {
      await connect();
      return;
    }
    if (!battleId) {
      alert("Battle not loaded!");
      return;
    }
    const success = await submitVote({
      participantId: activeAccountId,
      battleId: battleId,
      votedFor: id === "Art A" ? "Art A" : "Art B"
    });
    if (success) {
      
      setSuccess(true);
      alert('Vote submitted successfully!');
      setRefresh(prev => !prev); 
    } else {
      alert('Failed to submit vote. Maybe you already voted!');
    }
  };
  if (error) return <p>Error fetching battle details: {error}</p>;
//   if(loading) return <div className="flex items-center justify-center space-x-4" style={{marginTop:'100px'}} >
 
//   <div className="space-y-2">
//     <Skeleton className="h-4 w-[300px] " />
//     <Skeleton className="h-4 w-[300px]" />
//     <Skeleton className="h-40 w-[300px]" />
//   </div>
// </div>

  if (!todayBattle) {
    return (
      <div className="mt-10 pt-10 mx-8 flex justify-center">
        <div className='no-battle flex mt-5' style={{ width: 300, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8 }}>
          <h2 style={{ color: '#000', fontWeight: 600, fontSize: 18 }}>No Battles Today!</h2>
          <p className="px-5" style={{ color: '#000', textAlign: 'justify' }}>To start your battle by clicking the "Add Artwork" Button.</p>
          <div className="add-art-btn mt-5 text-center">
            <button onClick={toggleUploadModal} disabled={!isConnected} className={`px-4 py-2 vote-btn text-white bg-gray-900 rounded ${!isConnected ? 'cursor-not-allowed' : ''}`}>
              Add Artwork
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 pt-10 mx-8">
      {/* <h1 className='text-center text-black font-mono mt-5'>{todayBattle.arttitle}</h1> */}
      {timeRemaining !== null && (
        <h2 className=" pt-10 md:mt-9 sm:text-xl md:text-2xl lg:text-4xl  mt-5 text-lg font-semibold font-mono justify-center items-center text-black text-center" style={{ whiteSpace: 'nowrap' }}>
           {formatTime(timeRemaining)}
        </h2>
      )}
    <p  className='mt-2 text-center text-black font-mono  sm:font-thin md:text-lg'>Welcome to GFXvs, where creators compete with their masterpieces and you vote to win exclusive NFT rewards! Each day, two pieces of art face off, and you decide the winner by casting your vote. For each artwork, one lucky voter is awarded a 1:1 NFT, while everyone else receives participation reward editions. Join the battle by connecting your NEAR wallet, vote for your favorite art, and earn exclusive NFT rewards!</p>
    
      <div className='battle-img flex mt-2' style={{ justifyContent: 'center' }}>
            <ArtPiece art={artA} onVote={() => onVote(artA.id)} battleEndTime={todayBattle.endTime} success={success} votedFor={votedFor}/>
  
            <ArtPiece art={artB} onVote={() => onVote(artB.id)} success={success} votedFor={votedFor}/>
        
      </div>
     
    </div>
  );
};

export default ArtBattle;