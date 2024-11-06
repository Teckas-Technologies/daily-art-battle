import { useState, useEffect } from "react";
export interface CampaignPageData {
  _id: string;
  campaignUrl?: string;
  campaignName: string;
  campaignWelcomeText: string;
  startDate: string;
  endDate: string;
  publiclyVisible: boolean;
  creatorId?: string;
  specialRewards: number;
  isSpecialRewards?: boolean;
  totalRewards?: number;
  noOfWinners?: number;
  specialWinnerCount?: number;
  participants:number;
  distributedRewards?: boolean;
  email: string;
}
interface Campaign {
  campaign: Campaign[];
  totalDocuments: number;
  totalPages: number;
}
export interface ArtItem {
  raffleTickets: number;
  tokenId: number;
  isHided: boolean;
  _id: string;
  artistId: string;
  arttitle: string;
  colouredArt: string;
  grayScale: string;
  colouredArtReference: string;
  grayScaleReference: string;
  uploadedTime: string;
  upVotes: number;
  isCompleted: boolean;
  isStartedBattle: boolean;
  __v: number;
  battleTime: string;
  endTime: string;
  specialWinner: string;
  votes: number;
  campaignId: string;
  email: string;
}

interface ArtData {
  campaignId: string;
  artList: ArtItem[];
}

const useCampaigns = (idToken: string) => {
  const [campaign, setCampaign] = useState<CampaignPageData | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [campaignStatus, setCampaignStatus] = useState<string | null>(null);
  const [art, setArt] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [participants,setParticipants] = useState<any>(null);
  const fetchCampaigns = async (
    queryType: "current" | "upcoming" | "completed" | "myCampaigns",
    page: number = currentPage,
    limit: number = 10
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/campaign?queryType=${queryType}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${queryType} campaigns`);
      }

      const data = await response.json();
      // console.log(`${queryType} campaign data:`, data);
      setCampaignData(data.data.campaign);
      setTotalDocuments(data.data.totalDocuments);
      setTotalPages(data.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
 const fetchCampaignFromArtAPI = async (
  campaignId: string,
  page: number = 1,
  limit: number = 6
) => {
  setLoading(true);
  setError(null);

  try {
    console.log("Fetching art for Campaign ID:", campaignId);
    const response = await fetch(
      `/api/art?queryType=campaign&page=${page}&limit=${limit}&id=${campaignId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch campaign from art API`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    console.log("Arts Data:", data.arts);

    setArt(data.arts);
    setTotalDocuments(data.totalDocuments);
    console.log("Total Arts", totalDocuments);
    setTotalPages(data.totalPages);
    console.log("Total pages", totalPages);
    setCurrentPage(page);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unknown error occurred");
    }
    return null;
  } finally {
    setLoading(false);
  }
};

  const fetchBattles = async (campaignId: string, sort: string = "voteDsc") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/battle?queryType=battles&sort=${sort}&campaignId=${campaignId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch battles data");
      }

      const data = await response.json();
      setBattles(data.battles);
      // console.log("Fetched battles data:", data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignByTitle = async (title: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaign?title=${title}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaign data");
      }

      const data = await response.json();
      setCampaign(data.campaign);
      setCampaignStatus(data.status);
      setParticipants(data.participants);
      console.log(")))))",participants);
      console.log("Fetched participants:", data.participants);
      
    } catch (err) {
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignAnalytics = async (campaignId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaignAnalytics?id=${campaignId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch campaign analytics: ${response.statusText}`
        );
      }

      const data = await response.json();
      setAnalyticsData(data);
      // console.log("Analytics data >>", analyticsData);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error in fetchCampaignAnalytics:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentCampaign = (
    page: number = currentPage,
    limit: number = 10
  ) => fetchCampaigns("current", page, limit);
  const fetchUpcomingCampaigns = (
    page: number = currentPage,
    limit: number = 10
  ) => fetchCampaigns("upcoming", page, limit);
  const fetchPreviousCampaigns = (
    page: number = currentPage,
    limit: number = 10
  ) => fetchCampaigns("completed", page, limit);
  const fetchMyCampaigns = (page: number = currentPage, limit: number = 10) =>
    fetchCampaigns("myCampaigns", page, limit);

  useEffect(() => {
    if (idToken) {
      fetchCurrentCampaign();
    }
  }, [idToken]);

  const createCampaign = async (campaignData: {
    campaignUrl: string;
    campaignName: string;
    campaignWelcomeText: string;
    startDate: string;
    endDate: string;
    publiclyVisible: boolean;
    specialRewards: number;
    isSpecialRewards: boolean;
    totalRewards: number;
    noOfWinners: number;
    specialWinnerCount: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      const data = await response.json();
      console.log("New campaign created:", data);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateCampaign = async (updatedCampaignData: CampaignPageData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/campaign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updatedCampaignData),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error("Error Response:", errorData); 
        throw new Error("Connection Error. Please try again.");
      }

      const data = await response.json();
      console.log("Campaign updated successfully:", data);
      setCampaignData((prevCampaigns: CampaignPageData[]) =>
        prevCampaigns.map((campaign) =>
          campaign._id === updatedCampaignData._id ? data : campaign
        )
      );

      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const distributeArt = async (campaignId: string, artList: ArtItem[]): Promise<ArtData | null> => {
    setLoading(true);
    setError(null);

    const body: ArtData = {
        campaignId,
        artList,
    };

    console.log("Sending data to API:", body, idToken); // Log request details

    try {
        const response = await fetch("/api/distribute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Capture full error response
            console.error("API Error:", errorText); // Log full response error
            throw new Error("Failed to distribute art");
        }

        const data: ArtData = await response.json();
        console.log("Art distributed successfully:", data);
        return data;
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error distributing art:", err); // Log error details
            setError(err.message);
        } else {
            console.error("An unknown error occurred:", err); // Log unknown errors
            setError("An unknown error occurred");
        }
        return null;
    } finally {
        setLoading(false);
    }
};


  return {
    campaign,
    campaignData,
    loading,
    error,
    totalDocuments,
    totalPages,
    currentPage,
    fetchCurrentCampaign,
    fetchUpcomingCampaigns,
    fetchPreviousCampaigns,
    fetchMyCampaigns,
    createCampaign,
    fetchCampaignByTitle,
    campaignStatus,
    fetchCampaignAnalytics,
    analyticsData,
    fetchCampaignFromArtAPI,
    art,
    updateCampaign,
    fetchBattles,
    battles,
    distributeArt,
    participants
  };
};

export default useCampaigns;