import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
const useNearTransfer = () => {
     const {
      user,
      userTrigger,
      setUserTrigger,
      newUser,
      setNewUser,
      nearDrop,
      setNearDrop,
    } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const postNearTransfer = async (
    walletAddress: string,
    transactionHash: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/gfxCoin?queryType=nearTransfer&walletAddress=${walletAddress}&transactionHash=${transactionHash}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Parsed response >>:", result);
      setData(result);
      setUserTrigger(true);
      return result;
    } catch (err: any) {
      console.error("Error occurred:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };
  const getNearTransfer = async (transactionHash: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching with auth...");
      const response = await fetch(
        `/api/gfxCoin?transactionHash=${transactionHash}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response received:", response);

      if (!response.ok) {
        console.error("Response not OK:", {
          status: response.status,
          statusText: response.statusText,
        });
        return false;
      }
      setUserTrigger(true);
      const result = await response.json();
      console.log("Parsed response >>>:", result);

      return result;
    } catch (err: any) {
      console.error("Error occurred:", err);
      setError(err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  return { postNearTransfer, data, loading, error, getNearTransfer };
};

export default useNearTransfer;
