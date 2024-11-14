import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import "./LeaderBoard.css"
import InlineSVG from 'react-inlinesvg';
import { useState,useEffect,useRef } from 'react';
import { fetchWithAuth, setAuthToken } from '../../../utils/authToken';
import { useSession } from 'next-auth/react';
import { LeaderBoardCollectResponse, LeaderBoardCreatorsResponse, LeaderBoardResponse, useLeaderBoard, useLeaderBoardCollect, useLeaderBoardCreator } from '@/hooks/leaderboard';

const LeaderboardHolders = () => {
  const { leaderBoard, totalPage, fetchLeaderBoard } = useLeaderBoardCreator();
  const [topThreeData, setTopThreeData] = useState<LeaderBoardCreatorsResponse[]>([]);
  const [leaderboardData, setLeaderBoardData] = useState<LeaderBoardCreatorsResponse[]>([]);
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
      <div style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'scroll' }}  ref={leaderboardRef} className="w-full min-w-[800px] rounded-[32px] bg-[#0f0f0f] mr-10 border-[0.5px] mb-20 border-white p-8 max-h-[70vh]">
      <div className="flex justify-between mt-6 mb-6 pb-4 ml-5 gap-x-10">
      <span className="w-[100px] text-center">Rank</span>
      <span className="w-[200px] text-center">Username</span>
      <span className="w-[100px] text-center">Art Uploads</span>
      <span className="w-[200px] text-center">Battle participated</span>
      </div>
    <div >
    {topThreeData.map((user: LeaderBoardCreatorsResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center  justify-between p-4 mb-4 border-[0.5px] border-white rounded-xl ${getRowClass(user.rank)}`}
          >
            <div className="flex items-center ml-5 text-center gap-2 w-[100px]">
               <span className="text-yellow-400"><InlineSVG
               src={`/icons/${getMedalColor(user.rank)}.svg`}
               className={`h-6 w-6`}  
           /></span>  
            </div>
            <span className="w-[200px] text-center">{user.firstName+user.lastName}</span>
            <span className="w-[100px] text-center">{user.uploadedArtCount}</span>
            <span className="w-[200px] text-center">{user.battleArtCount}</span>

          </div>
        ))}
        {leaderboardData.map((user: LeaderBoardCreatorsResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center  justify-between p-4 mb-4 border-[0.5px] border-white rounded-xl ${getRowClass(user.rank)}`}
          >
            <div className="flex items-center ml-5 text-center gap-2 w-[100px]">
                <span>{user.rank}</span>
            </div>
            <span className="w-[200px] text-center">{user.firstName+user.lastName}</span>
            <span className="w-[100px] text-center">{user.uploadedArtCount}</span>
            <span className="w-[200px] text-center">{user.battleArtCount}</span>
          </div>
        ))}
        </div>
      </div>

      {/* Right Section - Top Rankings Cards */}
      <div className="w-full mt-[50px]">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#00ff00] to-[#009900] text-2xl font-bold mb-5">Top Rankings</h2>
        { topThreeData.map((user:LeaderBoardCreatorsResponse)=>(
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-5 mb-5 rounded-r-xl ${gettopRowClass(user.rank)} ${getWidthClass(user.rank)}`}
            >
              <img
                src={'/default-profile.png'}
                alt={user.firstName}
                className="w-12 h-12 rounded-full"
              />
             <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                {user.firstName+user.lastName}
                <img src='/images/Battle_Icon.png' className='w-6 h-6'></img>
                <span className='text-white'> {user.battleArtCount} Battles</span>
              </h3>
            </div>
            </div>
          ))}
      </div>
      <div className="fixed bottom-5 w-[110%] flex flex-col items-center gap-2">
  <button className="p-3 rounded-full shadow-lg transition-transform hover:scale-110">
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