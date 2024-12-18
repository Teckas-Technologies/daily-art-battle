import { useState } from "react";
import { UserDetails } from "@/types/types";

interface UseSendWalletDataResult {
  isLoading: boolean;
  error: string | null;
  userDetails: UserDetails | null;
  sufficientBalance: number | null;
  getUserDetails: () => Promise<UserDetails | null>;
  createUser: () => Promise<UserDetails | null>;
}

export const useSendWalletData = (): UseSendWalletDataResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sufficientBalance, setSufficientBalance] = useState<number | null>(null);

  const getUserDetails = async (): Promise<UserDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user");

      if (response.ok) {
        const userData = await response.json();
        console.log("hook",userData)
        setUserDetails(userData);
        setSufficientBalance(userData.user?.gfxCoin ?? 0);
        return userData;
      }

      // Handle unexpected response if needed
      setError("Unexpected response from the server.");
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (): Promise<UserDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user.");
      }

      const newUserData = await response.json();
      console.log("New user created successfully:", newUserData);
      setUserDetails(newUserData);
      setSufficientBalance(newUserData.user.gfxCoin);
      return newUserData;
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, userDetails, getUserDetails, createUser, sufficientBalance };
};
