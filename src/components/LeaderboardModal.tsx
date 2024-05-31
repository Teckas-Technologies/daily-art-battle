// components/LeaderboardModal.tsx
import React from 'react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboardData: Array<{ name: string, walletAddress: string, streak: number, rewards: string }>;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, leaderboardData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-5 rounded-lg max-w-md w-full mx-4 leaderboard-content">
        <button className="close-button absolute top-3 right-3" onClick={onClose}>×</button>
        <h2 className="text-lg font-bold mb-4">Leaderboard</h2>
        <div className="overflow-auto max-h-60">
          <table className="min-w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Wallet Address</th>
                <th className="text-left p-2">Streak</th>
                <th className="text-left p-2">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.walletAddress}</td>
                  <td className="p-2">{item.streak}</td>
                  <td className="p-2">{item.rewards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
