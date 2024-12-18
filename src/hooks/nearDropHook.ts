import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
const useNearDrop = () => {
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

  const postNearDrop = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/gfxCoin?queryType=nearDrop`,
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
      setUserTrigger(true);
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
