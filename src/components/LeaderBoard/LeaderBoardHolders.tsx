import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import "./LeaderBoard.css"
import InlineSVG from 'react-inlinesvg';
import { useState,useEffect,useRef } from 'react';
import { fetchWithAuth, getAuthToken, setAuthToken } from '../../../utils/authToken';
import { useSession } from 'next-auth/react';
import { LeaderBoardResponse, useLeaderBoard } from '@/hooks/leaderboard';
import Loader from '../ArtBattle/Loader/Loader';

const LeaderboardHolders = () => {
  const { leaderBoard, totalPage, fetchLeaderBoard } = useLeaderBoard();
  const [topThreeData, setTopThreeData] = useState<LeaderBoardResponse[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [leaderboardData, setLeaderBoardData] = useState<LeaderBoardResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [call,setCall] = useState(false);
  
  useEffect(() => {
    fetchInitialData()
}, []);

const fetchInitialData = async () => {
  setCall(true)
  await fetchLeaderboard(1);
  setCall(false);
};

  const fetchLeaderboard = async (page: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    const response = await fetchLeaderBoard(page);
    if (response && response.length > 0) {
      console.log(response);
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
  
      // Check if scrolled to the bottom (for infinite scrolling)
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
  
      // Check if scrolled past halfway (for "Scroll to top" button visibility)
      const halfwayPoint = scrollHeight / 5;
      setShowScrollButton(scrollTop >= halfwayPoint);
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
      return 'w-[396.26px] sm:w-[400px] md:w-[450px] lg:w-[480.75px] xl:w-[520px]';
    case 2:
      return 'w-[320.12px] sm:w-[320px] md:w-[360px] lg:w-[384.75px] xl:w-[420px]';
    case 3:
      return 'w-[283.93px] sm:w-[300px] md:w-[320px] lg:w-[341.25px] xl:w-[360px]';
    default:
      return 'w-full';
  }
};
// if(call){
// return <Loader md="21" sm="15" />
// }

  
 return (
  <div>
    {call ? (
        <div className="flex items-center mb-10 justify-center">
          <Loader md="22" sm="15" />
        </div>
      ):(

    
    <div className="spartan-medium flex custom-flex-row lg:felx-row mb-20 flex-col text-lg sm:text-sm md:text-base items-start justify-start w-full mt-10">
    {/* Left Section - Leaderboard Table */}
    <div
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'scroll', position: 'relative', }}
      ref={leaderboardRef}
      className="w-full relative lg:min-w-[800px] rounded-[32px] bg-[#0f0f0f] lg:mr-10 border-[0.5px] border-white p-4 md:p-8 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto mb-10"
    >
      {/* Leaderboard Header */}
      <div className="flex justify-between mt-6 mb-6 pb-4 gap-2 md:gap-4">
        <span className="w-[60px] sm:w-[80px] md:w-[100px] text-center text-xs sm:text-sm md:text-base">Rank</span>
        <span className="w-[100px] sm:w-[150px] md:w-[200px] lg:w-[350px] text-center text-xs sm:text-sm md:text-base">Username</span>
        <span className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[240px] text-center text-xs sm:text-sm md:text-base">GFX Points</span>
      </div>
  
      {/* Leaderboard Data */}
      <div>
        {topThreeData.map((user: LeaderBoardResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center justify-between p-4 mb-4 border-[0.5px] border-white rounded-xl ${getRowClass(user.rank)} gap-2 md:gap-4 text-xs sm:text-sm md:text-base`}
          >
            {/* Rank with Icon */}
            <div className="flex items-center gap-2 w-[40px] sm:w-[50px]">
              <InlineSVG src={`/icons/${getMedalColor(user.rank)}.svg`} className="h-6 w-6 text-yellow-400" />
            </div>
  
            {/* Username */}
            <span className="w-[100px] sm:w-[120px] md:w-[200px] lg:w-[250px] text-center break-words text-xs sm:text-sm md:text-base">
              {user.firstName + user.lastName}
            </span>
  
            {/* GFX Points with Icon */}
            <div className="flex items-center justify-between gap-2 w-[80px] sm:w-[100px] md:w-[140px] lg:w-[200px] text-xs sm:text-sm md:text-base">
              <InlineSVG src={`/icons/${getCoinColor(user.rank)}.svg`} className="h-6 w-6 flex-shrink-0 text-yellow-400" />
              <span className="break-words">{user.gfxvsCoins}</span>
            </div>
          </div>
        ))}
  
        {/* Additional Users List */}
        {leaderboardData.map((user: LeaderBoardResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center justify-between p-4 mb-4 border-[0.5px] ${session?.user?.email===user.email?"border-[#00FF00]":"border-white"} rounded-xl ${getRowClass(user.rank)} gap-2 md:gap-4 text-xs sm:text-sm md:text-base`}
          >
            <div className="w-[40px] sm:w-[50px] text-xs sm:text-sm md:text-base">{user.rank}</div>
            <span className="w-[100px] sm:w-[120px] md:w-[200px] lg:w-[250px] text-center break-words text-xs sm:text-sm md:text-base">
              {user.firstName + user.lastName}
            </span>
            <span className="w-[80px] sm:w-[100px] md:w-[140px] lg:w-[200px] break-words text-center text-xs sm:text-sm md:text-base">{user.gfxvsCoins}</span>
          </div>
        ))}
      </div>
      {showScrollButton && (
      <div className="sticky bottom-1 flex flex-col items-end">
    <button
      className="p-3 rounded-full shadow-lg transition-transform hover:scale-110"
      onClick={() => leaderboardRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <InlineSVG
        src="/icons/arrow.svg"
        className="h-10 w-10 bg-black rounded-full"
      />
    </button>
    <span className="text-white text-sm">Scroll to top</span>
  </div>
      )}

    </div>

  
    {/* Top Rankings Section */}
    <div className=" hidden lg:block w-full mt-1 md:mt-10 lg:mt-[50px]">
  <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#00ff00] to-[#009900] text-lg md:text-xl lg:text-2xl font-bold mb-5 text-left lg:text-left">
    Top Rankings
  </h2>
  {topThreeData.map((user: LeaderBoardResponse) => (
    <div
      key={user.rank}
      className={`flex items-center gap-4 p-4 sm:p-5 mb-5 rounded-r-xl ${gettopRowClass(user.rank)} ${getWidthClass(user.rank)} flex-row`}
    >
      {/* Profile Image */}
      {user.profileImg?(
            <img
            src={`${user.profileImg}`}
            alt={user.firstName}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
            />
      ):(
        <img
            src="/icons/User.png"
            alt={user.firstName}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
            />
      )}
      
      {/* User Information */}
      <div className="flex-1 text-center sm:text-left">
      <h3 className="text-white font-semibold flex flex-wrap items-center gap-2">
        <span className="whitespace-nowrap">{user.firstName} {user.lastName}</span>
        <InlineSVG src="/icons/gfx-point.svg" className="h-6 w-6 text-yellow-400" />
        <span>{user.gfxvsCoins}</span>
      </h3>
    </div>  

    </div>
  ))}
</div>

  
 {/* Scroll to Top Button */}
 {/* <div className="absolute bottom-5 max- flex flex-col items-center mb-20 gap-2">
  <button className="p-3 rounded-full shadow-lg transition-transform hover:scale-110"     onClick={() => leaderboardRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })}
  >
  <InlineSVG
    src="/icons/arrow.svg"
    className="h-10 w-10 bg-black rounded-full"
/>
  </button>
  <span className="text-white text-sm">Scroll to top</span>
</div> */}
  </div>
    )
  }
  </div>
  );
};

export default LeaderboardHolders;


