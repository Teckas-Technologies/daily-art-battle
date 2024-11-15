import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import "./LeaderBoard.css"
import InlineSVG from 'react-inlinesvg';
import { useState,useEffect,useRef } from 'react';
import { fetchWithAuth, setAuthToken } from '../../../utils/authToken';
import { useSession } from 'next-auth/react';
import { LeaderBoardCollectResponse, LeaderBoardResponse, useLeaderBoard, useLeaderBoardCollect } from '@/hooks/leaderboard';

const LeaderboardHolders = () => {
  const { leaderBoard, totalPage, fetchLeaderBoard } = useLeaderBoardCollect();
  const [topThreeData, setTopThreeData] = useState<LeaderBoardCollectResponse[]>([]);
  const [leaderboardData, setLeaderBoardData] = useState<LeaderBoardCollectResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setAuthToken(session?.idToken || '');
    fetchInitialData();
  }, [session]);

  const fetchInitialData = async () => {
    await fetchLeaderboard(1);
  };

  const fetchLeaderboard = async (page: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    const response = await fetchLeaderBoard(page);
    if (response && response.length > 0) {
      if (page === 1) {
        setTopThreeData(response.slice(0, 3));
        setLeaderBoardData(response.slice(3));
      } else {
        setLeaderBoardData((prev) => [...prev, ...response]);
      }
      setHasMore(response.length > 0);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  // Infinite Scroll Handler
  const handleScroll = () => {
    const container = leaderboardRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  // Fetch new data when currentPage changes
  useEffect(() => {
    if (currentPage > 1) fetchLeaderboard(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const container = leaderboardRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loading, hasMore]);
  const getRowClass = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-[#ffb600]/30 to-[#ffac33]/20';
    if (rank === 2) return 'bg-gradient-to-r from-[#FFFFFF4D]/30 to-[#B5B5B533]/20';
    if (rank === 3) return 'bg-gradient-to-r from-[#D853004D]/30 to-[#AC660033]/20';
    return 'text-white';
  };

  const gettopRowClass = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-l from-[#FFDD55] to-[#BA8912]';
    if (rank === 2) return 'bg-gradient-to-r from-[#D9D9D9] to-[#737373]';
    if (rank === 3) return 'bg-gradient-to-r from-[#AC6600] to-[#5B3225]';
    return 'text-white';
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'goldtrophy';
    if (rank === 2) return 'silvertrophy';
    if (rank === 3) return 'bronzetrophy';
    return '';
  };
  const getCoinColor = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  };
  const getWidthClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'w-full sm:w-[400px] md:w-[450px] lg:w-[480.75px]';
      case 2:
        return 'w-full sm:w-[320px] md:w-[360px] lg:w-[384.75px]';
      case 3:
        return 'w-full sm:w-[300px] md:w-[320px] lg:w-[341.25px]';
      default:
        return 'w-full';
    }
  };
  
  

  return (
    <div className="spartan-medium flex flex-col lg:flex-row items-start justify-start w-full mt-10">
    {/* Left Section - Leaderboard Table */}
    <div
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'scroll' }}
      ref={leaderboardRef}
      className="w-full lg:min-w-[800px] rounded-[32px] bg-[#0f0f0f] lg:mr-10 border-[0.5px] border-white p-4 md:p-8 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto mb-20"
    >
        <div className="flex justify-between mt-6 mb-6 pb-4 ml-5 mr-5 gap-x-6">
        <span className="w-[60px] min-w-[60px] text-center">Rank</span>
        <span className="w-[130px] min-w-[130px] text-center">Username</span>
        <span className="w-[92px] min-w-[92px] text-center">Rare NFTs</span>
        <span className="w-[164px] min-w-[164px] text-center">Participation NFTs</span>
        <span className="w-[59px] min-w-[59px] text-center">Total</span>
        <span className="w-[103px] min-w-[103px] text-center">GFX Points</span>
      </div>
    <div >
    {topThreeData.map((user: LeaderBoardCollectResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center  justify-between p-4 mb-4 border-[0.5px] border-white rounded-xl ${getRowClass(user.rank)}`}
          >
            <div className="flex items-center ml-5 text-center gap-2 w-[60px]">
               <span className="text-yellow-400"><InlineSVG
               src={`/icons/${getMedalColor(user.rank)}.svg`}
               className={`h-6 w-6`}  
           /></span>  
            </div>
            <span className="w-[130px] text-center">{user.firstName+user.lastName}</span>
            <span className="w-[92px] text-center">{user.rareNftCount}</span>
            <span className="w-[164px] text-center">{user.participationCount}</span>
            <span className="w-[59px] text-center">{user.rareNftCount+user.participationCount}</span>
            <div className="flex items-center text-center w-[103px] max-w-[103px] break-words gap-2 overflow-hidden">
              <>
                {/* Icon */}
                <span className="flex-shrink-0 text-yellow-400">
                  <InlineSVG
                    src={`/icons/${getCoinColor(user.rank)}.svg`}
                    className="h-6 w-6"
                  />
                </span>
                {/* GFX Points Text */}
                <span className="w-[103px] max-w-[103px]">{user.gfxCoin}</span>
              </>
            </div>

          </div>
        ))}
        {leaderboardData.map((user: LeaderBoardCollectResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center  justify-between p-4 mb-4 border-[0.5px] border-white rounded-xl ${getRowClass(user.rank)}`}
          >
            <div className="flex items-center ml-5 text-center gap-2 w-[60px]">
                <span>{user.rank}</span>
            </div>
            <span className="w-[130px] text-center">{user.firstName+user.lastName}</span>
            <span className="w-[92px] text-center">{user.rareNftCount}</span>
            <span className="w-[164px] text-center">{user.participationCount}</span>
            <span className="w-[59px] text-center">{user.rareNftCount+user.participationCount}</span>
            <div className="flex items-center text-center w-[103px] max-w-[103px] gap-2  break-words overflow-hidden ">
            <span className='ml-7 w-[103px] max-w-[103px]'>{user.gfxCoin}</span>
            </div>
          </div>
        ))}
        </div>
      </div>

       {/* Right Section - Top Rankings Cards */}
       <div className="w-full mt-10 lg:mt-[50px]">
  <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#00ff00] to-[#009900] text-lg md:text-xl lg:text-2xl font-bold mb-5 text-center lg:text-left">
    Top Rankings
  </h2>
  {topThreeData.map((user:LeaderBoardCollectResponse) => (
    <div
      key={user.rank}
      className={`flex items-center gap-4 p-4 sm:p-5 mb-5 rounded-r-xl ${gettopRowClass(user.rank)} ${getWidthClass(user.rank)} flex-row`}
    >
      {/* Profile Image */}
      <img
        src="/default-profile.png"
        alt={user.firstName}
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
      />
      
      {/* User Information */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-white font-semibold flex items-center gap-2">
             
{user.firstName+" "+user.lastName}
<span className="text-yellow-400"></span>
<span>{user.rareNftCount+user.participationCount} Collections</span>
        </h3>
      </div>
    </div>
  ))}
</div>
      <div className="fixed bottom-5 w-[110%] flex flex-col items-center gap-2">
  <button className="p-3 rounded-full shadow-lg transition-transform hover:scale-110"     onClick={() => leaderboardRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })}
  >
  <InlineSVG
    src="/icons/arrow.svg"
    className="h-10 w-10 bg-black rounded-full"
/>
  </button>
  <span className="text-white text-sm">Scroll to top</span>
</div>

    </div>
  );
};

export default LeaderboardHolders;

