import { useState } from "react";
const estFetchAmount = (queryFilter: string, coins: number) => {
  const [amount, setAmount] = useState<{
    totalUsdc?: number;
    totalNear?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyCoinAmount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/buyCoin?queryType=coins&queryFilter=${queryFilter}&coins=${coins}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch buy coin data.");
      }

      const result = await response.json();
      console.log("Response from Est ---", result);

      setAmount(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { amount, loading, error, fetchBuyCoinAmount };
};

export default estFetchAmount;
