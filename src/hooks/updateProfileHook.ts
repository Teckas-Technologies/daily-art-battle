import { useState } from "react";
import { getAuthToken } from "../../utils/authToken";

const useUpdateUserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (profileData: {
    profileImg: string;
  }) => {
    setIsLoading(true);
    setError(null);

    console.log("Initiating profile update...");
    console.log("Profile Data: ", profileData);

    try {
      const response = await fetch("/api/user?queryType=update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(profileData),
      });

      console.log("Response status: ", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response: ", errorText);
        throw new Error("Failed to update user profile");
      }

      const data = await response.json();
      console.log("Response Data: ", data);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Error occurred: ", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("Profile update process finished.");
    }
  };

  return {
    isLoading,
    error,
    updateUserProfile,
  };
};

export default useUpdateUserProfile;
