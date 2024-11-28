import { useState, useEffect } from "react";
import { fetchWithAuth, getAuthToken } from "../../utils/authToken";
import {
  NEXT_PUBLIC_VALID_CLIENT_ID,
  NEXT_PUBLIC_VALID_CLIENT_SECRET,
} from "@/config/constants";
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
  participants: number;
  distributedRewards?: boolean;
  email?: string;
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
  email?: string;
}

interface ArtData {
  campaignId: string;
  artList: ArtItem[];
  email?: string;
}

const useCampaigns = () => {
  const [campaign, setCampaign] = useState<CampaignPageData | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [campaignStatus, setCampaignStatus] = useState<string | null>(null);
  const [art, setArt] = useState<any[]>([]);
  const [artInfinite, setArtInfite] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [documents, setDocuments] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any>(null);
  const idToken = getAuthToken();
  // console.log("token", idToken);
  const fetchCampaigns = async (
    queryType: "current" | "upcoming" | "completed",
    page: number = currentPage,
    limit: number = 10
  ) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(
        `/api/campaign?queryType=${queryType}&page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
            "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${queryType} campaigns`);
      }

      const data = await response.json();
      console.log(`${queryType} campaign data:`, data);
      setCampaignData(data.data.campaign);
      setTotalDocuments(data.data.totalDocuments);
      setTotalPages(data.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof Error) {
        setIsError(err.message);
      } else {
        setIsError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
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
  const fetchMyCampaigns = async (
    queryType: "myCampaigns",
    page: number = currentPage,
    limit: number = 10
  ) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetchWithAuth(
        `/api/campaign?queryType=${queryType}&page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${queryType} campaigns`);
      }

      const data = await response.json();
      console.log(`${queryType} campaign data:`, data);
      setCampaignData(data.data.campaign);
      setTotalDocuments(data.data.totalDocuments);
      setTotalPages(data.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof Error) {
        setIsError(err.message);
      } else {
        setIsError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idToken) {
      fetchCurrentCampaign();
    }
  }, [idToken]);
  const fetchCampaignFromArtAPI = async (
    campaignId: string,
    page: number = 1,
    limit: number = 6
  ) => {
    setIsLoading(true);
    setIsError(null);

    try {
      console.log("Fetching art for Campaign ID:", campaignId);
      const response = await fetch(
        `/api/art?queryType=campaign&page=${page}&limit=${limit}&id=${campaignId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
            "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch campaign from art API`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Arts Data:", data.arts);
      console.log("Total Documents:", data.totalDocuments);
      setArt(data.arts);
      setDocuments(data.totalDocuments);
      setCurrentPage(page);

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setIsError(err.message);
      } else {
        setIsError("An unknown error occurred");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBattles = async (campaignId: string, sort: string = "voteDsc") => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(
        `/api/battle?queryType=battles&sort=${sort}&campaignId=${campaignId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
            "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch battles data");
      }

      const data = await response.json();
      setBattles(data.battles);
      console.log("Fetched battles data:", data);
      return data;
    } catch (err) {
      setIsError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaignByTitle = async (title: string) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const apiUrl = `/api/campaign?title=${title}`;
      console.log("API Request URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaign data");
      }

      const data = await response.json();
      setCampaign(data.campaign);
      console.log("Campaign >>>", data.campaign);

      setCampaignStatus(data.status);
      console.log("Status >>>", data.status);

      setParticipants(data.participants);
      console.log("Fetched participants:", data.participants);
      return !!data.campaign;
    } catch (err) {
      console.error("Error fetching campaign:", err);
      return false; 
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaignAnalytics = async (campaignId: string) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(`/api/campaignAnalytics?id=${campaignId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": NEXT_PUBLIC_VALID_CLIENT_ID,
          "x-client-secret": NEXT_PUBLIC_VALID_CLIENT_SECRET,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch campaign analytics: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(">>>>>>>>>>>>>>>>>>>>",data);
      
      setAnalyticsData(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setIsError(errorMessage);
      console.error("Error in fetchCampaignAnalytics:", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetchWithAuth("/api/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
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
        setIsError(err.message);
      } else {
        setIsError("An unknown error occurred");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const updateCampaign = async (updatedCampaignData: CampaignPageData) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetchWithAuth("/api/campaign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
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
      setIsError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const distributeArt = async (
    campaignId: string,
    artList: ArtItem[]
  ): Promise<ArtData | null> => {
    setIsLoading(true);
    setIsError(null);

    const body: ArtData = {
      campaignId,
      artList,
    };

    // console.log("Sending data to API:", body, idToken); // Log request details

    try {
      const response = await fetchWithAuth("/api/distribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to distribute art");
      }

      const data: ArtData = await response.json();
      console.log("Art distributed successfully:", data);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error distributing art:", err);
        setIsError(err.message);
      } else {
        console.error("An unknown error occurred:", err);
        setIsError("An unknown error occurred");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaign,
    campaignData,
    isLoading,
    isError,
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
    participants,
    documents,
    setIsLoading,
  };
};

export default useCampaigns;
