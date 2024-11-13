import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import "./LeaderBoard.css"
import InlineSVG from 'react-inlinesvg';
import { useState,useEffect } from 'react';
import { fetchWithAuth, setAuthToken } from '../../../utils/authToken';
import { useSession } from 'next-auth/react';
import { LeaderBoardResponse, useLeaderBoard } from '@/hooks/leaderboard';

const LeaderboardCreators = () => {
  const {leaderBoard,fetchLeaderBoard} = useLeaderBoard();
  const[leaderboardData,setLeaderBoardData] = useState<LeaderBoardResponse[]>([]);
  const { data: session, status } = useSession();
  useEffect(()=>{
    setAuthToken(session?.idToken || "");
    fetchLeaderboard();
  },[session]);

  const fetchLeaderboard = async()=>{
    await fetchLeaderBoard();
   setLeaderBoardData(leaderBoard);
  }


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
      <div className="w-full max-w-[800px] rounded-[32px] bg-[#0f0f0f] mr-10 border-[0.5px] mb-20 border-white p-8">
    <div className="flex justify-between mt-6 mb-6 pb-4 ml-5 gap-x-10">
      <span className="w-[100px] text-center">Rank</span>
      <span className="w-[200px] text-center">Username</span>
      <span className="w-[100px] text-center">Art Uploads</span>
      <span className="w-[200px] text-center">Battle participated</span>
    </div>
        {leaderboardData.map((user: LeaderBoardResponse) => (
          <div
            key={user.rank}
            className={`flex items-center text-center  justify-between p-4 mb-4 border-[0.5px] border-white rounded-xl ${getRowClass(user.rank)}`}
          >
            <div className="flex items-center ml-5 text-center gap-2 w-[50px]">
              {user.rank <= 3 ? (
               <span className="text-yellow-400"><InlineSVG
               src={`/icons/${getMedalColor(user.rank)}.svg`}
               className={`h-6 w-6`}  
           /></span>
              ) : (
                <span>{user.rank}</span>
              )}
            </div>
            <span className="w-[200px] text-center">{user.firstName+user.lastName}</span>
            <div className="flex items-center text-center w-[100px] gap-2">
            {user.rank <= 3 ?(
              <>
                 <span className="text-yellow-400"><InlineSVG
                 src={`/icons/${getCoinColor(user.rank)}.svg`}
                 className={`h-6 w-6`}  
             /></span>
              <span>{user.gfxvsCoins}</span>
             </>
              ):(
                <span className='ml-7 max-w-4'>{user.gfxvsCoins}</span>
              )}
             
            </div>
          </div>
        ))}
      </div>

      {/* Right Section - Top Rankings Cards */}
      <div className="w-full mt-[50px]">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#00ff00] to-[#009900] text-2xl font-bold mb-5">Top Rankings</h2>
        { leaderboardData.filter((user:LeaderBoardResponse) => user.rank <= 3)
          .map((user:any) => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-5 mb-5 rounded-r-xl ${gettopRowClass(user.rank)} ${getWidthClass(user.rank)}`}
            >
              <img
                src={user.image || '/default-profile.png'}
                alt={user.firstName}
                className="w-12 h-12 rounded-full"
              />
             <div className="flex-1">
              <h3 className="text-white font-semibold flex items-center gap-2">
                {user.firstName+user.lastName}
                <span className="text-yellow-400"><InlineSVG
                                        src="/icons/gfx-point.svg"
                                        className="h-6 w-6"
                                    /></span>
                <span>{user.gfxvsCoins}</span>
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

export default LeaderboardCreators;