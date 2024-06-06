//useVoting.ts is used for calling the vote api
import { useState, useCallback } from 'react';

interface Vote {
  participantId: string;
  battleId: string;
  votedFor: 'Art A' | 'Art B';
}

interface UseVotingReturn {
  votes: Vote[];
  error: string | null;
  loading: boolean;
  fetchVotes: (participantId: string, battleId: string) => Promise<Vote | null>;
  submitVote: (voteData: Vote) => Promise<boolean>;
}

export const useVoting = (): UseVotingReturn => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //fetchVotes is used for fetching votes by participantId and battle Id
  const fetchVotes = useCallback(async (participantId: string, battleId: string): Promise<Vote | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vote?participantId=${participantId}&battleId=${battleId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        if (data.data) {
          return data.data as Vote;
        }
        return null;
      } else {
        throw new Error(data.message || 'Error fetching votes');
      }
    } catch (err) {
      setError('Error fetching votes');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //SubmitVote is for creating vote for battle
  const submitVote = useCallback(async (voteData: Vote): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });
      const data = await response.json();
      if (response.ok) {
        setVotes((prevVotes) => [...prevVotes, voteData]);  // Optionally update local state
        setError(null);
        return true;
      } else {
        throw new Error(data.message || 'Failed to submit vote');
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
