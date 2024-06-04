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

  const fetchVotes = useCallback(async (participantId:any,artId:any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/artVote?participantId=${participantId}&artId=${artId}`);
      const data = await response.json();
      console.log(response);
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
      console.log(data);
      if (data.success) {
         if (await updateArt(voteData.artId)) {
          setError(null);
          return true;
         }
         return false;
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

  const updateArt = useCallback(async (artId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/art`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: artId }),
      });
      return res.ok;
    } catch (error) {
      console.error('Error updating art:', error);
      return false;
    }
  });
  

  return {
    votes,
    error,
    loading,
    fetchVotes,
    submitVote,
  };
};
