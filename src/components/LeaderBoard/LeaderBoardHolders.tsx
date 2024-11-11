import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import "./LeaderBoard.css"

const leaderboardData = [
  { rank: 1, username: 'Raghuvaran Karthik', points: 4567, image: '/profile.jpg' },
  { rank: 2, username: 'Raghuvaran Karthik', points: 4567, image: '/profile.jpg' },
  { rank: 3, username: 'Raghuvaran Karthik', points: 4567, image: '/profile.jpg' },
  { rank: 4, username: 'Raghuvaran Karthik', points: 4567 },
  { rank: 5, username: 'Raghuvaran Karthik', points: 4567 },
  { rank: 6, username: 'Raghuvaran Karthik', points: 4567 },
  { rank: 7, username: 'Raghuvaran Karthik', points: 4567 },
  { rank: 8, username: 'Raghuvaran Karthik', points: 4567 },
];

const LeaderboardHolders = () => {
  const getRowClass = (rank: number) => {
    if (rank === 1) return 'bg-[#7B5E2A] text-white';
    if (rank === 2) return 'bg-[#5A5A5A] text-white';
    if (rank === 3) return 'bg-[#4F2D1D] text-white';
    return 'bg-[#1C1C1C] text-white';
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-[#FFD700]';
    if (rank === 2) return 'text-[#C0C0C0]';
    if (rank === 3) return 'text-[#CD7F32]';
    return '';
  };

  return (
    <div className="spartan-medium flex flex-col lg:flex-row bg-black min-h-screen items-start justify-start mt-10 gap-1">
      {/* Left Section - Leaderboard Table */}
      <div className="w-full lg:w-[55%] rounded-[32px] bg-[#0f0f0f] border border-white p-8">
    <div className="flex justify-between mb-6 pb-4 ml-5">
      <span className="w-[60px]">Rank</span>
      <span className="w-[250px]">Username</span>
      <span className="w-[120px] text-right">GFX Points</span>
    </div>

        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center justify-between p-4 mb-4 rounded-xl ${getRowClass(user.rank)}`}
          >
            <div className="flex items-center gap-2 w-[50px]">
              {user.rank <= 3 ? (
                <FaTrophy className={getMedalColor(user.rank)} />
              ) : (
                <span>{user.rank}</span>
              )}
            </div>
            <span className="w-[200px]">{user.username}</span>
            <div className="flex items-center justify-end w-[100px] gap-2">
              <span className="text-yellow-400">●</span>
              <span>{user.points}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Section - Top Rankings Cards */}
      <div className="w-full ml-10 lg:w-1/3">
        <h2 className="text-green-500 text-2xl font-bold mb-5">Top Rankings</h2>
        {leaderboardData
          .filter((user) => user.rank <= 3)
          .map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-5 mb-5 rounded-xl ${getRowClass(user.rank)}`}
            >
              <img
                src={user.image || '/default-profile.png'}
                alt={user.username}
                className="w-14 h-14 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.username}</h3>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-yellow-400">●</span>
                  <span>{user.points}</span>
                </div>
              </div>
              {user.rank <= 3 && <FaTrophy className={getMedalColor(user.rank)} size={24} />}
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeaderboardHolders;
