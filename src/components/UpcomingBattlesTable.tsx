"use client";
import React, { useState, useEffect } from "react";
import { useFetchArts, ArtData } from "../hooks/artHooks";
import { useMbWallet } from "@mintbase-js/react";
import Image from "next/image";
import { useVoting, Vote } from "../hooks/useArtVoting";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
const UpcomingArtTable: React.FC<{
  toggleUploadModal: () => void;
  uploadSuccess: boolean;
}> = ({ toggleUploadModal, uploadSuccess }) => {
  const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { arts, totalPage, error, fetchMoreArts } = useFetchArts();
  const { isConnected } = useMbWallet();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const initializeData = async () => {
   
      fetchMoreArts(page);
    };
    const timeoutId = setTimeout(initializeData, 1000);

    return () => clearTimeout(timeoutId);
  }, [page, refresh, uploadSuccess, fetchMoreArts]);

  const [hasnext, setHasNext] = useState(false);

  useEffect(() => {
    if (arts) {
      if (page <= totalPage - 1) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
    setUpcomingArts(arts);
  }, [arts]);

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
    fetchMoreArts(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      fetchMoreArts(page - 1);
    }
  };


  
  return (
    <section id="upcoming">
    <div
      className="battle-table mt-[50px] pb-10 flex flex-col items-center"
      style={{ width: "100%", gap: 8 }}
    >
      <div className="battle-table1 pb-10">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          Upcoming Arts
        </h2>
        <p className="px-4 text-center text-white font-mono mt-5 md:ml-20 md:mr-20  lg:ml-20 lg:mr-20 sm:font-thin md:text-lg">
          Upvote your favorite artworks to influence what will be up for battle
          next. Think you’ve got what it takes? Upload your own masterpiece and
          join the competition!{" "}
        </p>
        <div className="flex justify-between items-center">
          <div className="mt-3 add-art-btn flex-auto text-center py-1  justify-center">
            <Button
              onClick={toggleUploadModal}
              disabled={!isConnected}
              className={`px-4 md:mr-5 py-2 vote-btn text-black bg-white hover:bg-gray-300 rounded ${
                !isConnected ? "cursor-not-allowed" : ""
              }`}
            >
              Add Artwork
            </Button>
          </div>
        </div>
        <BattleTable artData={upcomingArts} setRefresh={setRefresh} />
        <nav className="flex justify-center flex-wrap gap-5 mt-2">
          <a
          href="#upcoming"
            className={`shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              page <= 1
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </a>
          <a
           href="#upcoming"
            className={`shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              hasnext
                ? "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
                : "cursor-not-allowed"
            }`}
            onClick={hasnext ? handleNext : undefined}
          >
            Next
          </a>
        </nav>
      </div>
    </div>
    </section>
  );
};

const BattleTable: React.FC<{
  artData: ArtData[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ artData, setRefresh }) => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [upvotes, setVotes] = useState<Vote[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserVotes = async () => {
      if (activeAccountId) {
        const votes = await fetchVotes(activeAccountId);
        setVotes(votes);
      }
    };

    fetchUserVotes();
  }, [activeAccountId, fetchVotes]);

  const handleArt = (id:any)=>{
    router.push(`/art/${id}`);
  }

  const onVote = async (id: string) => {
    if (!isConnected || !activeAccountId) {
      await connect();
      return;
    }
    if (!id) {
      alert("art  not loaded!");
      return;
    }
    const success = await submitVote({
      participantId: activeAccountId,
      artId: id,
    });
    if (success) {
      setSuccess(true);
      const votes = await fetchVotes(activeAccountId);
      setVotes(votes);
      //   alert('Vote submitted successfully!');
      setRefresh((prev) => !prev);
    } else {
      alert("Failed to submit vote. Maybe you already voted!");
    }
  };

  return (
    <div
      className="mx-8 overflow-hidden battle-table container my-12 mx-auto px-4 md:px-12"
      style={{ zIndex: "-1" }}
    >
      <div className="battle-table grid grid-cols-3 gap-4 justify-center overflow-hidden">
        {artData.map((art, index) => (
          <div key={index} className="flex justify-center overflow-hidden">
            <div className="w-full flex flex-col h-full px-2 p-1 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-gray-200 shadow-md overflow-hidden relative">
              <div className="flex justify-center items-center flex-grow relative">
                <img
                onClick={()=>handleArt(art._id)}
                  src={art.colouredArt}
                  alt="Art A"
                  className="w-full h-full object-cover hover:cursor-pointer"
                  loading="lazy"
                  style={{
                    height: "100%", // Ensuring the image takes the full height of its container
                    aspectRatio: "1/1",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <button
                  onClick={() => onVote(art._id)}
                  className={`
    absolute bottom-0 right-1 text-white text-md sm:text-xl md:text-2xl h-6 right-0
    ${
      votes.some(
        (vote) =>
          vote.artId === art._id && vote.participantId === activeAccountId
      )
        ? "bg-green-800"
        : "bg-blue-700 hover:bg-blue-400"
    }
    text-white rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm md:px-5 md:py-2 md:text-base sm:h-12 md:h-15
  `}
                  disabled={votes.some(
                    (vote) =>
                      vote.artId === art._id &&
                      vote.participantId === activeAccountId
                  )}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      className="text-white mr-1 flex-shrink-0"
                    />
                    <h2 className="text-white text-md sm:text-xl md:text-xl flex-shrink-0">{`${art.upVotes}`}</h2>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UpcomingArtTable;
