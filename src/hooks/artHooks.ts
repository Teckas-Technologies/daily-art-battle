//artHooks.ts is used for calling the art api.
import { useState, useEffect } from 'react';

export interface ArtData {
  _id: string;
  artistId: string;
  arttitle: string;
  colouredArt: string;
  grayScale: string;
  colouredArtReference: string;
  grayScaleReference: string;
  uploadedTime: Date;
  upVotes : Number;
  isCompleted:Boolean;
  isStartedBattle:Boolean;
  specialWinner?: string;
  votes?:Number;
  battleTime?: Date;
  endTime?: Date;
  tokenId:Number;
}


interface BattlesResponse {
  pastBattles: ArtData[];
}


interface UseSaveDataResult {
  saveData: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null; 
  success: boolean | null;
}
export const useSaveData = (): UseSaveDataResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
//saveData is used for creating art.
  const saveData = async (data: any): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/art', {
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
  //useFetchArts is used for fetching arts by id
    export const useFetchArts = () => {
      const [arts, setArts] = useState<ArtData[]>([]);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);
    
      const fetchArts = async (page: number, limit: number = 10) => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/art?page=${page}&limit=${limit}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setArts(data);
        } catch (err) {
          setError("Error loading arts");
        } finally {
          setLoading(false);
        }
      };

      

    
      useEffect(() => {
        fetchArts(1);
      }, []);
    
      return { arts, loading, error, fetchMoreArts: fetchArts };
    }
  

    export const useFetchBattles = () => {
      const [battles, setBattles] = useState<BattlesResponse | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);
    
    
          const fetchBattles = async (sort:string,page: number, limit: number = 10) => {
              setLoading(true);
              setError(null);
              try {
                  const response = await fetch(`/api/art?queryType=battles&sort=${sort}&page=${page}&limit=${limit}`);
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
    
          useEffect(() => {
             fetchBattles("date",1);
          }, []);
         
    
      return { battles, loading, error,fetchMoreBattles: fetchBattles };
        }
 