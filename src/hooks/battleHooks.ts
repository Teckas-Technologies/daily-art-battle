// hooks/useFetchTodayBattle.ts
import { useState, useEffect } from 'react';

export interface BattleData {
  _id: string;
  artAId:string;
  artBId:string;
  startTime:Date;
  endTime:Date;
  isBattleEnded:Boolean;
  isNftMinted:Boolean;
  artAVotes:Number;
  artBVotes:Number;
  artAgrayScale: string;
  artBgrayScale: string;
  winningArt?: 'ArtA' | 'ArtB';
  specialWinner?: string;
}

interface UseFetchTodayBattleResult {
  todayBattle: BattleData | null;
  loading: boolean;
  error: string | null;
}

interface BattlesResponse {
  pastBattles: BattleData[];
  upcomingBattles: BattleData[];
}

interface UseSaveDataResult {
  saveData: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;  // Ensure that 'error' can be a string or null
  success: boolean | null;
}

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

export const useFetchTodayBattle = (): UseFetchTodayBattleResult => {
  const [todayBattle, setTodayBattle] = useState<BattleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayBattle = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/battle?queryType=Today');
        if (!response.ok) {
          throw new Error('Failed to fetch today\'s battle data');
        }
        const data: BattleData = await response.json();
        console.log(data);  
        setTodayBattle(data);
      } catch (error) {
        console.error('Error fetching today\'s battle data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayBattle();
  }, []);


  return { todayBattle, loading, error };
};


export const useFetchBattles = () => {
  const [battles, setBattles] = useState<BattlesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchBattles = async () => {
          setLoading(true);
          setError(null);
          try {
              const response = await fetch('/api/battle?queryType=battles');
              if (!response.ok) throw new Error('Network response was not ok');
              const data: BattlesResponse = await response.json();
              console.log("Fetched battles data:", data);
              setBattles(data);
          } catch (err) {
              console.error('Error fetching battles:', err);
              setError("Error fetching battles!");
          } finally {
              setLoading(false);
          }
      };

      fetchBattles();
  }, []);

  return { battles, loading, error };
};