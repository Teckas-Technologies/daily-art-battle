import { useState } from "react";
import { getAuthToken } from "../../utils/authToken";

const useDailyCheckin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dailyCheckin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dailyCheckin?queryType=daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to complete daily check-in");
      }

      const data = await response.json();
      console.log("Daily check-in response:", data);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const weeklyCheckin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dailyCheckin?queryType=weekly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to complete weekly check-in");
      }

      const data = await response.json();
      console.log("Weekly check-in response:", data);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { dailyCheckin, weeklyCheckin, loading, error };
};

export default useDailyCheckin;
