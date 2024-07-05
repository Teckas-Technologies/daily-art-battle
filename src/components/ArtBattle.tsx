"use client";
import React, { useEffect, useState } from "react";
import ArtPiece from "./ArtPiece";
import { useMbWallet } from "@mintbase-js/react";
import { useFetchTodayBattle } from "@/hooks/battleHooks";
import { useVoting } from "../hooks/useVoting";
import { Button } from "./ui/button";
import { ART_BATTLE_CONTRACT } from "@/config/constants";
import { Skeleton } from "./ui/skeleton";
import ArtTable from "../../model/ArtTable";
interface Artwork {
  id: string;
  imageUrl: string;
  name: string;
  title: string;
  artistId: string;
}

const ArtBattle: React.FC<{ toggleUploadModal: () => void }> = ({
  toggleUploadModal,
}) => {
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { todayBattle, loading, error, fetchTodayBattle } =
    useFetchTodayBattle();
  const [artA, setArtA] = useState<Artwork>({
    id: "ArtA",
    name: "Art A",
    imageUrl: "",
    title: "",
    artistId: "",
  });
  const [artB, setArtB] = useState<Artwork>({
    id: "ArtB",
    name: "Art B",
    imageUrl: "",
    title: "",
    artistId: "",
  });
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [battleId, setBattleId] = useState<string>();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [votedFor, setVoterFor] = useState("");
  const [refresh, setRefresh] = useState(false);
  const[popupA,setPopUpA] = useState(false);
  const[popupB,setPopUpB] = useState(false);
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
      alert("Vote submitted successfully!");
      setRefresh((prev) => !prev);
    } else {
      alert("Failed to submit vote. Maybe you already voted!");
    }
  };

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (event: any) => {
    if (!isDragging) return;

    let clientX;
    if (event.type === "touchmove") {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  
  const [skeletonLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []);

  const handlePopUpB = ()=>{
    setPopUpB(true);
  }
  const closePopUpB = ()=>{
    setPopUpB(false);
  }

  const handlePopUpA = ()=>{
    setPopUpA(true);
  }
  const closePopUpA = ()=>{
    setPopUpA(false);
  }


  if (skeletonLoading) {
    return (
      <div className="flex items-center justify-center space-x-4" style={{ marginTop: '100px' }}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-40 w-[300px]" />
        </div>
      </div>
    );
  }


 

  if (error) return <p>Error fetching battle details: {error}</p>;
  

  if (!todayBattle) {
    return (
      <div className="mt-10 pt-10 mx-8 flex justify-center">
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
    );
  }

  return (
    <div className="mt-10 mx-8">
      {timeRemaining !== null && (
        <h2
          className="mt-9 text-xl font-bold text-black text-center justify-center items-center text-black text-center"
          style={{ whiteSpace: "nowrap" }}
        >
          {formatTime(timeRemaining)}
        </h2>
      )}
      <p className=" text-center text-black font-mono  sm:font-thin mb-8 md:text-lg">
        Welcome to GFXvs, where creators clash for daily cash prizes. Cast your
        vote to secure participation NFTs and a chance to win an exclusive 1:1
        masterpiece. Connect your NEAR wallet to join the thrilling competition!
      </p>

      <div
        className="w-full relative"
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full max-w-[700px] aspect-square m-auto overflow-hidden select-none"
          onMouseMove={handleMove}
          onMouseDown={handleMouseDown}
          onTouchMove={handleMove}
          onTouchStart={handleTouchStart}
        >
          <img
            alt={artB.title}
            draggable={false}
            src={artB.imageUrl}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-0 left-0 right-0 bg-white w-full max-w-[700px] aspect-square m-auto overflow-hidden select-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              draggable={false}
              alt={artA.title}
              src={artA.imageUrl}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute top-0 bottom-0 w-1   cursor-ew-resize"
            style={{
              left: `calc(${sliderPosition}% - 1px)`,
              backgroundColor: "#30f216",
            }}
          >
            <div
              className="absolute flex items-center justify-center"
              style={{
                top: "calc(50% - 12px)",
                transform: "translateX(-50%)",
              }}
            >
              <svg
                className="w-10 h-10 mr-[20px] rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#1c7813"
                  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                />
              </svg>
              <svg
                className="w-10 h-10 ml-[25px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#1c7813"
                  d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4">
        <div className="flex flex-col items-center px-4">
          <p
            className="mt-4 max-h-5 text-black py-2 text-xs sm:text-sm font-small break-words text-center lg:break-all sm:break-all md:break-all"
            style={{ maxWidth: "300px" }}
          > 
          {popupA &&(
              <div className="absolute pb-10 max-h-5 py-2">
               <div className="bg-black border rounded-lg">
           <div className="popup-content">
            <span className="close text-xl justify-end text-orange-700 cursor-pointer" onClick={closePopUpA}>
              &times;
            </span>
            <p className="text-white py-2">{artA.title}</p>
          </div>  
        </div>
              </div>
            )}           
         
         {artA.title.length > 10 ? (
                  <>
                    {artA.title.substring(0, 10)}{' '}
                    <span
                      className="text-sky-600 cursor-pointer hover:underline max-h-5"
                     onClick={handlePopUpA}
                    >
                      read more
                    </span>
                  </>
                ) : (
                  artA.title
                )}
             
           
            {' '}
                by {artA.artistId}
          </p>
          {!popupA &&(
          <div className="flex items-center mt-10">
            {votedFor === artA.name ? (
              <Button
                onClick={() => onVote(artA.id)}
                disabled={!isConnected || success}
                className={`px-4 text-xs py-4 font-semibold bg-green-600 text-white rounded ${
                  !isConnected || success ? "cursor-not-allowed" : ""
                }`}
              >
                Voted {artA.name}
              </Button>
            ) : (
              <Button
                onClick={() => onVote(artA.id)}
                disabled={!isConnected || success}
                className={`px-4 text-xs  py-4 vote-btn text-white rounded ${
                  !isConnected || success ? "cursor-not-allowed" : ""
                }`}
              >
                Pick {artA.name}
              </Button>
            )}
          </div>
          )}
        </div>
        <div className="flex flex-col items-center px-4">
          <p
            className="mt-4  max-h-5  text-black py-2 text-xs sm:text-sm font-small break-words text-center sm:break-all md:break-normal"
            style={{ maxWidth: "300px" }}
          >
            {popupB &&(
              <div className="absolute pb-10 max-h-5 py-2">
               <div className="bg-black border rounded-lg">
           <div className="popup-content">
            <span className="close text-xl justify-end text-orange-700 cursor-pointer" onClick={closePopUpB}>
              &times;
            </span>
            <p className="text-white py-2">{artB.title}</p>
          </div>
        </div>
              </div>
            )}           
                {artB.title.length > 10 ? (
                  <>
                    {artB.title.substring(0, 10)}{' '}
                    <span
                      className="text-sky-600 cursor-pointer hover:underline max-h-5"
                     onClick={handlePopUpB}
                    >
                      read more
                    </span>
                  </>
                ) : (
                  artB.title
                )}
             
           
            {' '}
                by {artB.artistId}
          </p>
          {!popupB &&(
          <div className="flex items-center  mt-10 max-h-10">
           
            {votedFor === artB.name ? (
              <Button
                onClick={() => onVote(artB.id)}
                disabled={!isConnected || success}
                className={`px-4 text-xs font-semibold bg-green-600 text-white rounded ${
                  !isConnected || success ? "cursor-not-allowed" : ""
                }`}
              >
                Voted {artB.name}
              </Button>
            ) : (
              <Button
                onClick={() => onVote(artB.id)}
                disabled={!isConnected || success}
                className={`px-4 text-xs vote-btn text-white rounded ${
                  !isConnected || success ? "cursor-not-allowed" : ""
                }`}
              >
                Pick {artB.name}
              </Button>
            )}
         
          </div>
)}
        </div>
      </div>

      {/* <div className='battle-img flex mt-2' style={{ justifyContent: 'center' }}>
            <ArtPiece art={artA} onVote={() => onVote(artA.id)} battleEndTime={todayBattle.endTime} success={success} votedFor={votedFor}/>
  
            <ArtPiece art={artB} onVote={() => onVote(artB.id)} success={success} votedFor={votedFor}/>
        
      </div>
      */}
    </div>
  );
};

export default ArtBattle;
