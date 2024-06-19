//useArtVoting.ts is used for calling artVoting api.
import { useState, useCallback } from 'react';
interface Vote {
  participantId: string;
  artId: string;
}

interface UseVotingReturn {
  votes: Vote[];
  error: string | null;
  loading: boolean;
  fetchVotes: (participantId: string, artId: string) => Promise<boolean>;
  submitVote: (voteData: Vote) => Promise<boolean>;
}

export const useVoting = (): UseVotingReturn => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //fetchVotes is used to fetch artVote by participantId and artId
  const fetchVotes = useCallback(async (participantId:any,artId:any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/artVote?participantId=${participantId}&artId=${artId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        if(data.data){
          return true;
         
        }
        return false;
      } else {
        throw new Error(data.message || 'Error fetching votes');
      }
    } catch (err) {
      setError('Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  //submitVote is used to create vote the art
  const submitVote = useCallback(async (voteData: Vote): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/artVote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });
      const data = await response.json();

      if (response.ok) {
         return true;
      } else {
        throw new Error("error"+data.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError('Error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    votes,
    error,
    loading,
    fetchVotes,
    submitVote,
  };
};
