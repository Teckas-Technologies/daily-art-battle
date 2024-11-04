import { useState } from "react";

interface ApiResponse {
  user?: any;
  error?: string;
  message?: string;
}

interface UseSendWalletDataResult {
  isLoading: boolean;
  error: string | null;
  userDetails: any; 
  sufficientBalance: number | null;
  sendWalletData: (idToken: string, walletAddress: string) => Promise<void>;
}

export const useSendWalletData = (): UseSendWalletDataResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null); 
  const [sufficientBalance, setSufficientBalance] = useState<any>(null);
  const sendWalletData = async (idToken: string, walletAddress: string) => {
    setIsLoading(true); 
    setError(null); 

    try {
      const userExistsResponse = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (userExistsResponse.ok) {
        const userData = await userExistsResponse.json(); 
        console.log("User already exists:", userData);
        setUserDetails(userData);
        setSufficientBalance(userData.user?.gfxCoin ?? 0); 
        return;
      }

      if (userExistsResponse.status === 400) {
        const errorResponse = await userExistsResponse.json();
        if (errorResponse.error === "User not found") {
          await createUser(idToken, walletAddress);
        } else {
          console.error("Error checking user existence:", errorResponse);
          setError(errorResponse.error); 
          return;
        }
      } else {
        console.error(
          "Unexpected response while checking user existence:",
          userExistsResponse.status
        );
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error processing wallet data:", error);
      setError("Failed to process wallet data."); 
    } finally {
      setIsLoading(false); 
    }
  };

  const createUser = async (idToken: string, walletAddress: string) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
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

  return { isLoading, error, userDetails, sendWalletData,sufficientBalance };
};
