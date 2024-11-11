// hooks/useFetchTodayBattle.ts
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/authToken';

export interface BattleData {
  _id: string;
  artAId:string;
  artBId:string;
  artAartistId:string;
  artBartistId:string;
  artAtitle: string;
  artBtitle: string;
  startTime:Date;
  endTime:Date;
  isBattleEnded:Boolean;
  isNftMinted:Boolean;
  artAVotes:Number;
  artBVotes:Number;
  grayScale?: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  grayScaleReference?: string;
  winningArt?: 'Art A' | 'Art B';
  specialWinner?: string;
  artAspecialWinner?: string;
  artBspecialWinner?: string;
  artAvoters?:string[];
  artBvoters?:string[];
  isSpecialWinnerMinted?:Boolean;
  tokenId:string;
  videoSpinner: string;
  videoSpinnerReference: string;
  emoji1: string;
  emoji2: string;
  artAartistEmail: string;
  artBartistEmail: string;
}

interface UseFetchTodayBattleResult {
  todayBattle: BattleData | null;
  loading: boolean;
  error: string | null;
  battle:boolean;
  fetchTodayBattle: (campaignId: string) => Promise<void>; 
}

interface BattlesResponse {
  pastBattles: BattleData[];
  totalDocuments:any;
  totalPages:any
}


interface UseSaveDataResult {
  saveData: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;  // Ensure that 'error' can be a string or null
  success: boolean | null;
}
//useSaveData is used to create battle
export const useSaveData = (): UseSaveDataResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Allow 'error' to be a string or null
  const [success, setSuccess] = useState<boolean | null>(null);

  const saveData = async (data: any): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/battle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  return { saveData, loading, error, success };
};
//useFetchTodayBattle is used to fetch today battle
export const useFetchTodayBattle = (): UseFetchTodayBattleResult => {
  const [todayBattle, setTodayBattle] = useState<BattleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [battle, setBattle] = useState<boolean>(false);

  const fetchTodayBattle = async (campaignId:string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(campaignId);
      const response = await fetchWithAuth(`/api/battle?queryType=Today&campaignId=${campaignId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s battle data');
      }
      const data: BattleData = await response.json();
     if(data==null){
      setBattle(true)
     }
      setTodayBattle(data);
    } catch (error) {
      console.error('Error fetching today\'s battle data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  return { todayBattle,battle, loading, error, fetchTodayBattle }; // Include fetchTodayBattle in the return object
};

//useFetchBattles is used to fetch battles with pagination
export const useFetchBattles = () => {
  const [battles, setBattles] = useState<BattlesResponse | null>(null);
  const [totalPage, setTotalPage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


      const fetchBattles = async (campaignId:string,sort:string,page: number, limit: number = 6) => {
          setLoading(true);
          setError(null);
          try {
              const response = await fetch(`/api/battle?queryType=battles&campaignId=${campaignId}&sort=${sort}&page=${page}&limit=${limit}`);
              if (!response.ok) throw new Error('Network response was not ok');
              const data: BattlesResponse = await response.json();
              setBattles(data);
              setTotalPage(data.totalPages);
              return data;
          } catch (err) {
              console.error('Error fetching battles:', err);
              setError("Error fetching battles!");
          } finally {
              setLoading(false);
          }
      };

      const fetchBattlesByVotes = async (page: number, limit: number = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/battle?queryType=battles&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data: BattlesResponse = await response.json();
         
            setBattles(data);
        } catch (err) {
            console.error('Error fetching battles:', err);
            setError("Error fetching battles!");
        } finally {
            setLoading(false);
        }
    };
     

  return { battles, totalPage, loading, error,fetchMoreBattles: fetchBattles,fetchBattlesbyVotes:fetchBattlesByVotes };
};
