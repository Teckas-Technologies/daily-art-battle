import { useState, useEffect } from "react";
export interface CampaignPageData {
  _id: string;
  campaignUrl: string;
  campaignName: string;
  campaignWelcomeText: string;
  startDate: string;
  endDate: string;
  publiclyVisible: boolean;
  creatorId: string;
  specialRewards: number;
  isSpecialRewards: boolean;
  totalRewards: number;
  noOfWinners: number;
  specialWinnerCount: number;
}
interface Campaign {
  campaign: Campaign[]; 
  totalDocuments: number;
  totalPages: number;
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
  const [connectionError, setConnectionError] = useState(false);
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
      console.log(`${queryType} campaign data:`, data);
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
      console.log("Campaign data from art API:", data);
      setArt(data.arts);
      console.log("arts", art);

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
      console.log("Analytics data >>", analyticsData);

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
    setConnectionError(false);
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
        if (response.status === 503) {
          setConnectionError(true);
          throw new Error("Connection Error. Please try again.");
        } else {
          throw new Error("Failed to create campaign");
        }
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
    connectionError
  };
};

export default useCampaigns;