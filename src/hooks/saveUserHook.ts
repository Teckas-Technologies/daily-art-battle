import { useState } from "react";
import { fetchWithAuth } from "../../utils/authToken";
import { UserDetails } from "@/types/types";

interface UseSendWalletDataResult {
  isLoading: boolean;
  error: string | null;
  userDetails: UserDetails | null;
  sufficientBalance: number | null;
  sendWalletData: (walletAddress: string) => Promise<UserDetails | null>;
}

export const useSendWalletData = (): UseSendWalletDataResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sufficientBalance, setSufficientBalance] = useState<any>(null);
  const sendWalletData = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userExistsResponse = await fetchWithAuth("/api/user");

      if (userExistsResponse.ok) {
        const userData = await userExistsResponse.json();
        // console.log("User already exists:", userData);
        setUserDetails(userData);
        setSufficientBalance(userData.user?.gfxCoin ?? 0);
        return userData;
      }

      if (userExistsResponse.status === 400) {
        const errorResponse = await userExistsResponse.json();
        if (errorResponse.error === "User not found") {
          await createUser(walletAddress);
          return null;
        } else {
          console.error("Error checking user existence:", errorResponse);
          setError(errorResponse.error);
          return null;
        }
      } else {
        console.error(
          "Unexpected response while checking user existence:",
          userExistsResponse.status
        );
        setError("Unexpected response from the server.");
        return null;
      }
    } catch (error) {
      console.error("Error processing wallet data:", error);
      setError("Failed to process wallet data.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (walletAddress: string) => {
    try {
      const response = await fetchWithAuth("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user.");
      }

      const newUserData = await response.json();
      console.log("New user created successfully:", newUserData);
      setUserDetails(newUserData);
      setSufficientBalance(newUserData.user.gfxCoin);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return { isLoading, error, userDetails, sendWalletData, sufficientBalance };
};