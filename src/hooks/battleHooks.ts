// hooks/useFetchTodayBattle.ts
import { useState, useEffect } from "react";

export interface BattleData {
  _id: string;
  artAId: string;
  artBId: string;
  artAartistId: string;
  artBartistId: string;
  artAtitle: string;
  artBtitle: string;
  startTime: Date;
  endTime: Date;
  isBattleEnded: Boolean;
  isNftMinted: Boolean;
  artAVotes: Number;
  artBVotes: Number;
  grayScale?: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  grayScaleReference?: string;
  winningArt?: "Art A" | "Art B";
  specialWinner?: string;
  artAspecialWinner?: string;
  artBspecialWinner?: string;
  artAvoters?: string[];
  artBvoters?: string[];
  isSpecialWinnerMinted?: Boolean;
  tokenId: string;
}

interface UseFetchTodayBattleResult {
  todayBattle: BattleData | null;
  loading: boolean;
  error: string | null;
  battle: boolean;
  fetchTodayBattle: () => Promise<void>;
}

interface BattlesResponse {
  pastBattles: BattleData[];
  totalDocuments: any;
  totalPages: any;
}

interface UseSaveDataResult {
  saveData: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null; // Ensure that 'error' can be a string or null
  success: boolean | null;
}
interface UseFetchBattlesByArtistResult {
  artistBattles: BattleData[] | null;
  loading: boolean;
  error: string | null;
  fetchBattlesByArtist: (artistId: string) => Promise<void>;
}
interface UseFetchBattlesBySpecialWinnerResult {
  specialWinnerBattles: BattleData[] | null;
  loading: boolean;
  error: string | null;
  fetchBattlesByRaffleOwner: (specialWinnerId: string) => Promise<void>;
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
      const response = await fetch("/api/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save data");
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

  const fetchTodayBattle = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/battle?queryType=Today");
      if (!response.ok) {
        throw new Error("Failed to fetch today's battle data");
      }
      const data: BattleData = await response.json();
      if (data == null) {
        setBattle(true);
      }
      setTodayBattle(data);
    } catch (error) {
      console.error("Error fetching today's battle data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayBattle();
  }, []);

  return { todayBattle, battle, loading, error, fetchTodayBattle }; // Include fetchTodayBattle in the return object
};

//useFetchBattles is used to fetch battles with pagination
export const useFetchBattles = () => {
  const [battles, setBattles] = useState<BattlesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBattles = async (
    sort: string,
    page: number,
    limit: number = 10
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/battle?queryType=battles&sort=${sort}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data: BattlesResponse = await response.json();

      setBattles(data);
    } catch (err) {
      console.error("Error fetching battles:", err);
      setError("Error fetching battles!");
    } finally {
      setLoading(false);
    }
  };

  const fetchBattlesByVotes = async (page: number, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/battle?queryType=battles&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data: BattlesResponse = await response.json();

      setBattles(data);
    } catch (err) {
      console.error("Error fetching battles:", err);
      setError("Error fetching battles!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBattles("dateDsc", 1);
  }, []);

  return {
    battles,
    loading,
    error,
    fetchMoreBattles: fetchBattles,
    fetchBattlesbyVotes: fetchBattlesByVotes,
  };
};

export const useFetchBattlesBySpecialWinner =
  (): UseFetchBattlesBySpecialWinnerResult => {
    const [specialWinnerBattles, setSpecialWinnerBattles] = useState<
      BattleData[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBattlesByRaffleOwner = async (specialWinnerId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/battle?queryType=RaffleOwner&specialWinnerId=${specialWinnerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch battles by Raffle owner");
        }
        const data: BattleData[] = await response.json();
        setSpecialWinnerBattles(data);
      } catch (error) {
        console.error("Error fetching battles by Raffle owner:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    return {
      specialWinnerBattles,
      loading,
      error,
      fetchBattlesByRaffleOwner,
    };
  };
  export const useFetchBattlesByArtist = (): UseFetchBattlesByArtistResult => {
    const [artistBattles, setArtistBattles] = useState<BattleData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchBattlesByArtist = async (artistId: string) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(
          `/api/battle?queryType=ByArtist&artistId=${artistId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch battles for the artist");
        }
  
        const data: BattleData[] = await response.json();
        setArtistBattles(data);
      } catch (error) {
        console.error("Error fetching battles by artist:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
  
    return { artistBattles, loading, error, fetchBattlesByArtist };
  };