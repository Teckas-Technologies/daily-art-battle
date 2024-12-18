import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAuth } from "@/contexts/AuthContext";
const useFetchBuyCoin = (queryFilter: "usdc" | "near") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
   const {
      user,
      userTrigger,
      setUserTrigger,
      newUser,
      setNewUser,
      nearDrop,
      setNearDrop,
    } = useAuth();
  const fetchBuyCoinData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/buyCoin?queryType=list&queryFilter=${queryFilter}`
      );

      // console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch buy coin data.");
      }

      const result = await response.json();
      // console.log("Fetched result:", result);

      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        // console.error("Error occurred:", err.message);
      } else {
        setError("An unknown error occurred.");
        // console.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
      // console.log("Finished fetching data.");
    }
  };

  useEffect(() => {
    // console.log("useEffect triggered for queryFilter:", queryFilter);
    fetchBuyCoinData();
  }, [queryFilter, user]);

  return { data, loading, error };
};

export default useFetchBuyCoin;
