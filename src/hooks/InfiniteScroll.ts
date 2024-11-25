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
    setIsLoading(true);
    setIsError(null);

    try {
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

      if (!response.ok) {
        throw new Error("Failed to fetch campaign from art API");
      }

      const data = await response.json();
      setArtItems((prev) => (page === 1 ? data.arts : [...prev, ...data.arts]));
      setTotalDocuments(data.totalDocuments);
      setHasMore(data.arts.length > 0 && data.arts.length === limit);
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

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      fetchCampaignFromArtAPI(currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, hasMore, isLoading]);

  useEffect(() => {
    // Fetch initial page arts
    fetchCampaignFromArtAPI(1);
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
