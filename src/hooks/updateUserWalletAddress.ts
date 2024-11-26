import { useState } from "react";
import { fetchWithAuth, getAuthToken } from "../../utils/authToken";

const useUpdateUserWalletAddress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserWalletAddress = async (profileData: { nearAddress: string }) => {
        setIsLoading(true);
        setError(null);

        console.log("Initiating profile update...");
        console.log("Profile Data: ", profileData);

        try {
            const response = await fetchWithAuth("/api/user?queryType=update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${getAuthToken()}`,
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
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            console.error("Error occurred: ", errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        updateUserWalletAddress,
    };
};

export default useUpdateUserWalletAddress;
