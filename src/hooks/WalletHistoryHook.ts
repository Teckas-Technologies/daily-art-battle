import { useState } from "react";
import { getAuthToken } from "../../utils/authToken";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
    _id: string;
    email: string;
    gfxCoin: number;
    transactionType: string;
    createdAt: string;
    updatedAt: string;
  }

const useFetchTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    user,
    userTrigger,
    setUserTrigger,
    newUser,
    setNewUser,
    nearDrop,
    setNearDrop,
  } = useAuth();
  let userDetails = user;
  const fetchTransactions = async (page: number = 1, limit: number = 20) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching transactions for page: ${page}, limit: ${limit}`);
      const response = await fetch(`/api/transactions?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Transactions Data:", data.transaction);
      setUserTrigger(!userTrigger)
      setTransactions(data.transaction);
      setTotalDocuments(data.totalDocuments);
      console.log("Total Transactions:", data.totalDocuments);
      setTotalPages(data.totalPages);
      console.log("Total Pages:", data.totalPages);
      setCurrentPage(page);

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
    transactions,
    loading,
    error,
    totalDocuments,
    totalPages,
    currentPage,
    fetchTransactions,
  };
};

export default useFetchTransactions;
