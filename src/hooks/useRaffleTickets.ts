//useArtVoting.ts is used for calling artVoting api.
import { useAuth } from '@/contexts/AuthContext';
import { useState, useCallback } from 'react';
export interface Vote {
  ticketCount: number;
  artId: string;
  campaignId: string;
  participantId?: string;
}

interface UseTicketReturn {
  raffleCount: number;
  error: string | null;
  loading: boolean;
  fetchArtUserRaffleCount: (artId: string, campaignId: string) => Promise<number>;
  submitVote: (voteData: Vote) => Promise<boolean>;
  updateRaffleMint: (raffleId: string, queryType: string) => Promise<boolean>;
}

export const useArtsRaffleCount = (): UseTicketReturn => {
   const {
      user,
      userTrigger,
      setUserTrigger,
      newUser,
      setNewUser,
      nearDrop,
      setNearDrop,
    } = useAuth();
  const [raffleCount, setRaffleCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //fetchVotes is used to fetch ArtRaffleCount by artId & campaignId
  const fetchArtUserRaffleCount = useCallback(async (artId: string, campaignId: string): Promise<number> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/raffleTicket?artId=${artId}&campaignId=${campaignId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        if (data) {
          setRaffleCount(data.totalRaffleCounts);
          return data?.totalRaffleCounts;
        }
        return 0; // Return an empty array if data.data is falsy
      } else {
        throw new Error(data.message || 'Error fetching votes');
      }
    } catch (err) {
      setError('Error');
      return 0; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  }, []);


  //submitVote is used to create vote the art
  const submitVote = useCallback(async (voteData: Vote): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/raffleTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });
      const data = await response.json();

      if (response.ok) {
        setUserTrigger(true);
        return true;
      } else {
        throw new Error("error" + data.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError('Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRaffleMint = useCallback(async (raffleId: string, queryType: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log("TEST 1")
      const response = await fetch(`/api/raffleTicket?raffleId=${raffleId}&queryType=${queryType}`, {
        method: 'PUT', 
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Response OKK!!!!!!!!!!!", data)
        return true;
      } else {
        throw new Error('Error' + data.message || 'Failed to update vote');
      }
    } catch (err) {
      setError('Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    raffleCount,
    error,
    loading,
    fetchArtUserRaffleCount,
    submitVote,
    updateRaffleMint
  };
};
