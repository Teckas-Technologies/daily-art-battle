import { useEffect, useState, useCallback } from 'react';
import { fetchWithAuth } from '../../utils/authToken';

export interface LeaderBoardResponse {
  firstName: string;
  lastName: string;
  gfxvsCoins: any;
  rank: any;
}

export interface LeaderBoardCollectResponse {
  _id: string;
  raffleTicketCount: number;
  email:string;
  firstName: string;
  lastName: string;
  gfxCoin: number;
  nearAddress: string;
  rank: number;
  participationCount: number;
  rareNftCount: number;
}

export interface LeaderBoardCreatorsResponse {
  _id: string;
  uploadedArtCount: number;
  email:string;
  firstName: string;
  lastName: string;
  rank: number;
  battleArtCount:number;
}


export const useLeaderBoard = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoardResponse[]>([]);
  const [totalPage,setTotalPage]= useState();
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
          setTotalPage(data.totalPage)
          console.log(data);
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

  return { leaderBoard,totalPage, fetchLeaderBoard, loading, error };
};


export const useLeaderBoardCollect = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoardCollectResponse[]>([]);
  const [totalPage,setTotalPage]= useState();
  const fetchLeaderBoard = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      console.log(page,limit);
      const response = await fetchWithAuth(`/api/leaderboard?queryType=collectors&page=${page}&limit=${limit}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        if (data && data.data) {
          setLeaderBoard(data.data);
          setTotalPage(data.totalPage)
          console.log(data);
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

  return { leaderBoard,totalPage, fetchLeaderBoard, loading, error };
};



export const useLeaderBoardCreator = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoardCreatorsResponse[]>([]);
  const [totalPage,setTotalPage]= useState();
  const fetchLeaderBoard = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      console.log(page,limit);
      const response = await fetchWithAuth(`/api/leaderboard?queryType=creators&page=${page}&limit=${limit}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        if (data && data.data) {
          setLeaderBoard(data.data);
          setTotalPage(data.totalPage)
          console.log(data);
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

  return { leaderBoard,totalPage, fetchLeaderBoard, loading, error };
};
