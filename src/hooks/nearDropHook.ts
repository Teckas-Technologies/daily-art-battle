import { useState } from "react";
import { fetchWithAuth, getAuthToken } from "../../utils/authToken";

const useNearDrop = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const postNearDrop = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `/api/gfxCoin?queryType=nearDrop`,
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
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Parsed response >>:", result);
      setData(result);
      return result;
    } catch (err: any) {
      console.error("Error occurred:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };
  return { postNearDrop, data, loading, error };
};

export default useNearDrop;
