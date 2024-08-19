"use client";
import React, { useEffect, useState } from "react";
import { useMbWallet } from "@mintbase-js/react";
import { useFetchTodayBattle } from "@/hooks/battleHooks";
import { useVoting } from "../hooks/useVoting";
import { Skeleton } from "./ui/skeleton";
import Toast from './Toast'; 

interface Artwork {
  id: string;
  imageUrl: string;
  name: string;
  title: string;
  artistId: string;
} 

const ArtBattle: React.FC<{ toggleUploadModal: () => void, campaignId: string }> = ({
  toggleUploadModal, campaignId
}) => {
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { todayBattle, loading, battle, error, fetchTodayBattle } = useFetchTodayBattle();
  const [artA, setArtA] = useState<Artwork>({ id: "ArtA", name: "Art A", imageUrl: "", title: "", artistId: "" });
  const [artB, setArtB] = useState<Artwork>({ id: "ArtB", name: "Art B", imageUrl: "", title: "", artistId: "" });
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [battleId, setBattleId] = useState<string>();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [votedFor, setVoterFor] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [popupA, setPopUpA] = useState(false);
  const [popupB, setPopUpB] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null); 
  const [skeletonLoad, setSkeletonLoading] = useState(true);

  useEffect(() => {
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
    fetchTodayBattle(campaignId);
  }, [todayBattle, fetchVotes, refresh]);

  useEffect(() => {
    if (battle) {
      console.log(battle)
      setSkeletonLoading(false);
    }
  }, [battle]);

  useEffect(() => {
    if (!battle && todayBattle) {
      setSkeletonLoading(false);
    }
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
      setArtA({
        id: "Art A",
        name: "Art A",
        imageUrl: todayBattle.artAcolouredArt,
        title: todayBattle.artAtitle,
        artistId: todayBattle.artAartistId,
      });
      setArtB({
        id: "Art B",
        name: "Art B",
        imageUrl: todayBattle.artBcolouredArt,
        title: todayBattle.artBtitle,
        artistId: todayBattle.artBartistId,
      });
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
      votedFor: id === "Art A" ? "Art A" : "Art B",
    });
    if (success) {
      setSuccess(true);
      setToastMessage("Vote submitted successfully!");
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      setRefresh((prev) => !prev);
    } else {
      alert("Failed to submit vote. Maybe you already voted!");
    }
  };

  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpin((prev) => !prev);
    }, 3000); // Spin every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePopUpB = () => {
    setPopUpB(true);
  }
  const closePopUpB = () => {
    setPopUpB(false);
  }

  const handlePopUpA = () => {
    setPopUpA(true);
  }
  const closePopUpA = () => {
    setPopUpA(false);
  }

  if (error) return <p>Error fetching battle details: {error}</p>;

  return (
    <div className="mt-10 mx-8">
      <div className="mt-9">
        {timeRemaining !== null && (
          <h2
            className="text-4xl font-bold text-white text-center justify-center items-center text-black"
            style={{ whiteSpace: "nowrap" }}
          >
            {formatTime(timeRemaining)}
          </h2>
        )}
        <p className="mt-2 text-center text-white font-mono sm:font-thin mb-8 md:text-lg">
          Welcome to GFXvs, where creators clash for daily cash prizes. Cast your
          vote to secure participation NFTs and a chance to win an exclusive 1:1
          masterpiece. Connect your NEAR wallet to join the thrilling competition!
        </p>

        {skeletonLoad ? (
          <div className="flex items-center justify-center space-x-4" style={{ marginTop: '50px' }}>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-40 w-[300px]" />
            </div>
          </div>
        ) : (
          <>
            {!todayBattle ? (
              <div className="mt-4 mx-8 flex justify-center">
                <div
                  className="no-battle flex mt-5"
                  style={{
                    width: 300,
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                  }}
                >
                  <h2 style={{ color: "#000", fontWeight: 600, fontSize: 18 }}>
                    No Battles Today!
                  </h2>
                  <p className="px-5" style={{ color: "#000", textAlign: "justify" }}>
                    To start your battle by clicking the "Add Artwork" Button.
                  </p>
                  <div className="add-art-btn mt-5 text-center">
                    <button
                      onClick={toggleUploadModal}
                      disabled={!isConnected}
                      className={`px-4 py-2 vote-btn text-white bg-gray-900 rounded ${
                        !isConnected ? "cursor-not-allowed" : ""
                      }`}
                    >
                      Add Artwork
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full relative">
                  <div className={`relative w-full max-w-[700px] aspect-square m-auto overflow-hidden select-none ${spin ? 'spin-animation' : ''}`}>
                    <img
                      alt={artB.title}
                      draggable={false}
                      src={artB.imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-0 left-0 right-0 w-full max-w-[700px] aspect-square m-auto overflow-hidden select-none"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img
                        draggable={false}
                        alt={artA.title}
                        src={artA.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <div className="flex-1">
                    <button
                      onClick={() => onVote("Art A")}
                      disabled={success}
                      className={`w-full py-2 px-4 text-white bg-green-500 rounded ${
                        success && votedFor === "Art A" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Vote for Art A
                    </button>
                    <button
                      onClick={() => handlePopUpA()}
                      className="w-full py-2 px-4 text-white bg-blue-500 rounded mt-2"
                    >
                      More Info A
                    </button>
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => onVote("Art B")}
                      disabled={success}
                      className={`w-full py-2 px-4 text-white bg-red-500 rounded ${
                        success && votedFor === "Art B" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Vote for Art B
                    </button>
                    <button
                      onClick={() => handlePopUpB()}
                      className="w-full py-2 px-4 text-white bg-blue-500 rounded mt-2"
                    >
                      More Info B
                    </button>
                  </div>
                </div>

                {popupA && (
                  <div className="popup-modal">
                    <div className="modal-content">
                      <span className="close" onClick={closePopUpA}>&times;</span>
                      <h2>{artA.title}</h2>
                      <p>Artist ID: {artA.artistId}</p>
                      <img src={artA.imageUrl} alt={artA.title} className="w-full" />
                    </div>
                  </div>
                )}

                {popupB && (
                  <div className="popup-modal">
                    <div className="modal-content">
                      <span className="close" onClick={closePopUpB}>&times;</span>
                      <h2>{artB.title}</h2>
                      <p>Artist ID: {artB.artistId}</p>
                      <img src={artB.imageUrl} alt={artB.title} className="w-full" />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default ArtBattle;
