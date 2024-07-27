'use client';

import { useEffect, useState } from 'react';
import { ArtData, useFetchArtById,useFetchArts } from '@/hooks/artHooks';
import { NearWalletConnector } from '@/components/NearWalletConnector';
import { useMbWallet } from "@mintbase-js/react";
import { useVoting, Vote } from "@/hooks/useArtVoting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';

const Home = ({ params }: { params: { id: string } }) => {
  const { fetchArtById } = useFetchArtById();
  const [upcomingArt, setUpcomingArt] = useState<ArtData>();
  const[url,setUrl] = useState('');
  const[message,setMessage] = useState('Check out this art and put your votes');
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [upvotes, setVotes] = useState<Vote[]>([]);
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (activeAccountId) {
        const votes = await fetchVotes(activeAccountId);
        setVotes(votes);
      }
    };

    fetchUserVotes();
  }, [activeAccountId, fetchVotes,success]);
  
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
    } else {
      alert("Failed to submit vote. Maybe you already voted!");
    }
  };

  useEffect(() => {
   setUrl(window.location.href)
    const fetchArt = async () => {
      try {
        const art = await fetchArtById(params.id);
        setUpcomingArt(art);
      } catch (error) {
        console.error('Failed to fetch art:', error);
      }
    };

    fetchArt();
  }, [params.id,success]);

  return (
    <>
      <video autoPlay muted loop id="background-video" style={{ position: 'fixed', right: 0, bottom: 0,  objectFit: 'cover', minWidth: '100%', minHeight: '100%', zIndex: -1,filter: 'blur(5px) brightness(50%)', }}>
    <source src="../../images/back.mp4" type="video/mp4" />
    Your browser does not support the video tag.
    </video>
     <NearWalletConnector />
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src={upcomingArt?.colouredArt} alt="" />
        </a>
        {upcomingArt &&(
        <div className="p-5">
       
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Title:  {upcomingArt?.arttitle}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Artist Id: {upcomingArt?.artistId}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Up Votes: {`${upcomingArt?.upVotes}`}
          </p>
         
          <button
                  onClick={() => onVote(upcomingArt?._id||'')}
                  className={` text-black text-md sm:text-xl md:text-2xl h-6 right-0
    ${
      votes.some(
        (vote) =>
          vote.artId === upcomingArt?._id && vote.participantId === activeAccountId
      )
        ? "bg-green-800"
        : "bg-blue-700 hover:bg-blue-400"
    }
     text-black rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm md:px-5 md:py-2 md:text-base sm:h-12 md:h-15
  `}
                  disabled={votes.some(
                    (vote) =>
                      vote.artId === upcomingArt?._id &&
                      vote.participantId === activeAccountId
                  )}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      className="text-white mr-1 mb-3 h-5 flex-shrink-0"
                    />
                    <h2 className="mb-3 text-white text-md sm:text-xl md:text-xl flex-shrink-0">{`${upcomingArt?.upVotes}`}</h2>
                  </div>
                </button>

            
        </div>
      )}

        <div className='flex justify-center mt-2  mb-3 px-6'>
       <a href={`https://twitter.com/intent/tweet?url=%20${url}%2F&via=mintbase&text=${message}`}  target="_blank"> <svg className="w-6 h-6 cursor-pointer "  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#0d0d0d" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
         <a href={`https://telegram.me/share/url?url=${url}&text=${message}`}  target="_blank">   <svg className="w-6 h-6 cursor-pointer ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="#0e0f10" d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"/></svg></a>
         <a href={`https://api.whatsapp.com/send?text=${message}%20${url}`} target="_blank">   <svg className="w-6 h-6 cursor-pointer ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#0a0a0b" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>
            </div>
      </div>
    </>
  );
};

export default Home;