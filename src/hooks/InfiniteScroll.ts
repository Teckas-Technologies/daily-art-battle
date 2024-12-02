import { useState, useEffect, useCallback } from "react";

interface ArtItem {
  _id: string;
  artistId: string;
  colouredArt: string;
  arttitle: string;
  upVotes: number;
}

const useInfiniteScroll = (campaignId: string, limit: number = 8) => {
  const [artItems, setArtItems] = useState<ArtItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const fetchCampaignFromArtAPI = async (page: number) => {
    console.log("Fetching campaign data for page:", page);
    setIsLoading(true);
    setIsError(null);

    try {
      console.log("Sending API request...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(
        `/api/art?queryType=campaign&page=${page}&limit=${limit}&id=${campaignId}`,
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
        throw new Error("Failed to fetch campaign from art API");
      }

      const data = await response.json();
      console.log("API response data:", data);

      setArtItems((prev) =>
        page === 1 ? data.arts : [...prev, ...data.arts]
      );
      setTotalDocuments(data.totalDocuments);
      setHasMore(data.arts.length > 0 && data.arts.length === limit);

      console.log("Updated art items:", artItems);
      console.log("Total documents:", totalDocuments);
      console.log("Has more:", hasMore);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching campaign data:", err.message);
        setIsError(err.message);
      } else {
        console.error("Unknown error occurred");
        setIsError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
      console.log("Loading state:", isLoading);
    }
  };

  const loadMore = useCallback(() => {
    console.log("Load more triggered. Current page:", currentPage);
    if (hasMore && !isLoading) {
      console.log("Loading more art items...");
      fetchCampaignFromArtAPI(currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, hasMore, isLoading]);

  useEffect(() => {
    console.log("Campaign ID changed:", campaignId);
    fetchCampaignFromArtAPI(1); // Fetch the initial page
  }, [campaignId]);

  return {
    artItems,
    isLoading,
    isError,
    hasMore,
    totalDocuments,
    loadMore,
  };
};

export default useInfiniteScroll;
