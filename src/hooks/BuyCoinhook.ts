import { useState, useEffect } from "react";
import { fetchWithAuth, getAuthToken } from "../../utils/authToken";
import { useAuth } from "@/contexts/AuthContext";

const useFetchBuyCoin = (queryFilter: "usdc" | "near") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  let userDetails = user;
  const fetchBuyCoinData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `/api/buyCoin?queryType=list&queryFilter=${queryFilter}`
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch buy coin data.");
      }

      const result = await response.json();
      console.log("Fetched result:", result);

      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error occurred:", err.message);
      } else {
        setError("An unknown error occurred.");
        console.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
      console.log("Finished fetching data.");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered for queryFilter:", queryFilter);
    fetchBuyCoinData();
  }, [queryFilter, userDetails]);

  return { data, loading, error };
};

export default useFetchBuyCoin;