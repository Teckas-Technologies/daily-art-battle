import { useEffect, useState, useCallback } from 'react';
import { fetchWithAuth } from '../../utils/authToken';

export interface LeaderBoardResponse {
  firstName: string;
  lastName: string;
  gfxvsCoins: any;
  rank: any;
}

export const useLeaderBoard = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoardResponse[]>([]);

  const fetchLeaderBoard = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      console.log(page,limit);
      const response = await fetchWithAuth(`/api/leaderboard?queryType=points&page=${page}&limit=${limit}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        if (data && data.data) {
          setLeaderBoard(data.data);
          console.log(data.data);
          return data.data;
        }
      } else {
        throw new Error(data.message || 'Error fetching leaderboard');
      }
    } catch (err) {
      setError('Error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Log leaderboard data after it updates
  useEffect(() => {
    console.log(leaderBoard);
  }, [leaderBoard]);

  return { leaderBoard, fetchLeaderBoard, loading, error };
};
