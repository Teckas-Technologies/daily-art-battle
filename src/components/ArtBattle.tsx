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
}

const ArtBattle: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { todayBattle, loading, error } = useFetchTodayBattle();
  const [artA, setArtA] = useState<Artwork>({ id: 'ArtA', name: 'Art A', imageUrl: '' });
  const [artB, setArtB] = useState<Artwork>({ id: 'ArtB', name: 'Art B', imageUrl: '' });
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [battleId, setBattleId] = useState<string>();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  console.log(todayBattle);

  useEffect(() => {
    const fetchData = async () => {
      if (todayBattle && activeAccountId) {
        const res = await fetchVotes(activeAccountId, todayBattle._id);
        if (res) {
          setSuccess(true);
        }
      }
    };

    fetchData();
  }, [todayBattle, activeAccountId, fetchVotes]);

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
      setArtA({ id: 'ArtA', name: 'Art A', imageUrl: todayBattle.artAgrayScale });
      setArtB({ id: 'ArtB', name: 'Art B', imageUrl: todayBattle.artBgrayScale });
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
      votedFor: id === "ArtA" ? "ArtA" : "ArtB"
    });
    if (success) {
      setSuccess(true);
      alert('Vote submitted successfully!');
    } else {
      alert('Failed to submit vote. Maybe you already voted!');
    }
  };

  if (loading) return <p>Loading battle details...</p>;
  if (error) return <p>Error fetching battle details: {error}</p>;

  if (!todayBattle) {
    return (
      <div className="mt-10 pt-10 mx-8 flex justify-center">
        <div className='no-battle flex mt-5' style={{ width: 300, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8 }}>
          <h2 style={{ color: '#000', fontWeight: 600, fontSize: 18 }}>No Battles Today!</h2>
          <p className="px-5" style={{ color: '#000', textAlign: 'justify' }}>To start your battle by clicking the "Add Artwork" Button.</p>
          <div className="add-art-btn mt-5 text-center">
            <button onClick={toggleUploadModal} disabled={!isConnected} className={`px-4 py-2 vote-btn text-white rounded ${!isConnected ? 'cursor-not-allowed' : ''}`}>
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
      <div className='battle-img flex' style={{ justifyContent: 'center' }}>
        <ArtPiece art={artA} onVote={() => onVote(artA.id)} battleEndTime={todayBattle.endTime} success={success} />
        <ArtPiece art={artB} onVote={() => onVote(artB.id)} success={success} />
      </div>
      {timeRemaining !== null && (
        <div className="text-lg font-semibold font-mono justify-center items-center text-black text-center py-6" style={{ whiteSpace: 'nowrap' }}>
          Time remaining: {formatTime(timeRemaining)}
        </div>
      )}
    </div>
  );
};

export default ArtBattle;
