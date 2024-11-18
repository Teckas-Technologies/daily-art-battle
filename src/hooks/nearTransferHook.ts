import { useState } from "react";
import { fetchWithAuth, getAuthToken } from "../../utils/authToken";

const useNearTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const postNearTransfer = async (
    walletAddress: string,
    transactionHash: string
  ) => {
    console.log("postNearTransfer called with:", {
      walletAddress,
      transactionHash,
    });
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching with auth...");
      const response = await fetch(
        `/api/gfxCoin?queryType=nearTransfer&walletAddress=${walletAddress}&transactionHash=${transactionHash}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      console.log("Response received:", response);

      if (!response.ok) {
        console.error("Response not OK:", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Parsed response JSON:", result);
      setData(result);
    } catch (err: any) {
      console.error("Error occurred:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  return { postNearTransfer, data, loading, error };
};

export default useNearTransfer;
