import { useState } from "react";
import { getAuthToken } from "../../utils/authToken";

const useDailyCheckin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [claimDate, setClaimDate] = useState<String | null>(null);
  const [lastWeeklyClaimDate, setLastWeeklyClaimDate] = useState<String | null>(
    null
  );
  const [checkinData, setCheckinData] = useState<any>(null);
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

      const postData = await response.json();
      console.log("Daily check-in response:", postData);
      return postData;
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

  const fetchDailyCheckin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dailyCheckin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch daily check-in data");
      }

      const data = await response.json();
      setCheckinData(data);
      setStreakDays(data.data.streakDays);
      setClaimDate(data.data.lastClaimedDate);
      setLastWeeklyClaimDate(data.data.lastWeeklyClaimDate);
      console.log("Last claim date", claimDate);

      console.log("Fetched daily check-in data:", data);
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

  return {
    dailyCheckin,
    weeklyCheckin,
    fetchDailyCheckin,
    checkinData,
    streakDays,
    claimDate,
    lastWeeklyClaimDate,
    loading,
    error,
  };
};

export default useDailyCheckin;
