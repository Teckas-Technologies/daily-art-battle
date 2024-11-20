import { useState, useEffect } from "react";
import {
  NEXT_PUBLIC_VALID_CLIENT_ID,
  NEXT_PUBLIC_VALID_CLIENT_SECRET,
} from "@/config/constants";
interface BattleData {
  _id: string;
  campaignId: string;
  artAId: string;
  artBId: string;
  artAartistId: string;
  artBartistId: string;
  artAtitle: string;
  artBtitle: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  startTime: string;
  endTime: string;
  isBattleEnded: boolean;
  isSpecialWinnerMinted: boolean;
  isNftMinted: boolean;
  artAVotes: number;
  artBVotes: number;
  artAvoters: string[];
  artBvoters: string[];
  __v: number;
  winningArt: string;
  grayScale: string;
  grayScaleReference: string;
  specialWinner: string;
  tokenId: string;
}

const useBattleData = (id: string) => {
  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBattleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/battle?queryType=byid&id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch battle data");
      }
      const data: BattleData = await response.json();
      setBattleData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBattleData();
  }, [id]);
  return { battleData, loading, error, fetchBattleData };
};

export default useBattleData;
