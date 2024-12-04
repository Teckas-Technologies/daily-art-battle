import { useState } from "react";
import { fetchWithAuth, getAuthToken } from "../../utils/authToken";

interface PostResponse {
  
  message: string;
 
}

const useSendNearDrop = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PostResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendNearDrop = async (payload: object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        "/api/gfxCoin?queryType=nearDrop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("Near drop >>>>>>>>",responseData);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { sendNearDrop, isLoading, response, error };
};

export default useSendNearDrop;