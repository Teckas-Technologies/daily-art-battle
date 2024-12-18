//artHooks.ts is used for calling the art api.
import { useState, useEffect } from 'react';
import { NEXT_PUBLIC_VALID_CLIENT_ID, NEXT_PUBLIC_VALID_CLIENT_SECRET } from '@/config/constants';
import { useAuth } from '@/contexts/AuthContext';

export interface ArtData {
  _id: string;
  artistId: string;
  arttitle: string;
  colouredArt: string;
  colouredArtReference: string;
  uploadedTime: Date;
  upVotes: Number;
  isCompleted: Boolean;
  isStartedBattle: Boolean;
  specialWinner?: string;
  votes?: Number;
  battleTime?: Date;
  endTime?: Date;
  tokenId: Number;
  campaignId: string;
  raffleTickets: Number;
  artistName: string;
}


interface BattlesResponse {
  pastBattles: ArtData[];
  totalDocuments: any;
  totalPages: any
}


interface UseSaveDataResult {
  saveData: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean | null;
}
export const useSaveData = (): UseSaveDataResult => {
   const {
      user,
      userTrigger,
      setUserTrigger,
      newUser,
      setNewUser,
      nearDrop,
      setNearDrop,
    } = useAuth();
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

      const responseText = await response.text();
      if (responseText) {
        const responseData = JSON.parse(responseText);
        console.log("Response Data >> ", responseData);
        setSuccess(true);
      } else {
        console.warn('Empty response from server');
        setSuccess(false);
      }
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
  const [totalPage, setTotalPage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArts = async (campaignId: string, sort: string, page: number, limit: number = 8) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/art?campaignId=${campaignId}&sort=${sort}&page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log("data:", data)
      setArts(data.arts);
      setTotalPage(data.totalPages)
      return data?.arts;
    } catch (err) {
      setError("Error loading arts");
    } finally {
      setLoading(false);
    }
  };


  return { arts, totalPage, loading, error, fetchMoreArts: fetchArts };
}


export const useFetchBattles = () => {
  const [battles, setBattles] = useState<BattlesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchBattles = async (sort: string, page: number, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/art?queryType=battles&sort=${sort}&page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        }
      });
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
    fetchBattles("date", 1);
  }, []);


  return { battles, loading, error, fetchMoreBattles: fetchBattles };
}




export const useFetchArtById = () => {
  const [art, setArts] = useState<ArtData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchArtById = async (id: string) => {
    if(!id) {
      console.log("NOT ID");
    }
    console.log(" ID ", id);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/art?queryType=upcoming&id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      setArts(data.art);
      return data.art;
    } catch (err) {
      console.error('Error fetching art:', err);
      setError("Error fetching art!");
    } finally {
      setLoading(false);
    }
  };

  return { fetchArtById };
}

export const useHideArt = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hideSuccess, setSuccess] = useState<boolean | null>(null);

  const hideArt = async (artId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/hideArt', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artId: artId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const responseData = await response.json();
      console.log("Response Data >> ", responseData);

      setSuccess(true);
      return responseData;
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save data');
      return { message: "failed"}
    } finally {
      setLoading(false);
    }
  };

  return { hideArt, loading, error, hideSuccess };
};

export const useSearchArts = () => {
  const [arts, setArts] = useState<ArtData[]>([]);
  const [totalSearchPage, setTotalPage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchArts = async (campaignId: string, name: string, page: number, limit: number = 8) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/art?queryType=coming&campaignId=${campaignId}&name=${name}&page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log("data:", data)
      setArts(data.arts);
      setTotalPage(data.totalPages)
      return data?.arts;
    } catch (err) {
      setError("Error loading arts");
    } finally {
      setLoading(false);
    }
  };


  return { arts, totalSearchPage, loading, error, searchArts };
}