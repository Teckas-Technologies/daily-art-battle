import { useState, useEffect, useCallback } from "react";

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const useInfiniteScrollForCampaign = (campaignId: string, limit: number = 20) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const fetchParticipants = async (page: number) => {
    console.log("Fetching participants for page:", page); 
    setIsLoadingState(true);
    setIsError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Sending API request...");
      const response = await fetch(
        `/api/campaignAnalytics?queryType=participants&page=${page}&limit=${limit}&id=${campaignId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-id": process.env.NEXT_PUBLIC_VALID_CLIENT_ID || "",
            "x-client-secret":
              process.env.NEXT_PUBLIC_VALID_CLIENT_SECRET || "",
          },
        }
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch participants data");
      }

      const data = await response.json();
      console.log("API response data:", data);

      const users = data.uniqueWallets.users;
      console.log("Fetched users:", users);

      setParticipants((prev) => (page === 1 ? users : [...prev, ...users]));
      setTotalDocuments(data.uniqueWallets.totalDocuments);
      setHasMore(users.length > 0 && users.length === limit);
      console.log("Updated participants:", participants);
      console.log("Total documents:", totalDocuments);
      console.log("Has more:", hasMore);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching participants:", err.message);
        setIsError(err.message);
      } else {
        console.error("Unknown error occurred");
        setIsError("An unknown error occurred");
      }
    } finally {
      setIsLoadingState(false);
      console.log("Loading state:", isLoadingState);
    }
  };

  const loadMore = useCallback(() => {
    console.log("Load more triggered. Current page:", currentPage);
    if (hasMore && !isLoadingState) {
      console.log("Loading more participants...");
      fetchParticipants(currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, hasMore, isLoadingState]);

  useEffect(() => {
    console.log("Campaign ID changed:", campaignId);
    fetchParticipants(1);
  }, [campaignId]);

  return {
    participants,
    isLoadingState,
    isError,
    hasMore,
    totalDocuments,
    loadMore,
  };
};

export default useInfiniteScrollForCampaign;
