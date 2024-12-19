import { useState } from "react";
const useFetchReferralLink = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getReferralLink = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/referral");

            console.log("Response status: ", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error Response: ", errorText);
                throw new Error("Failed to get user referral");
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
        getReferralLink,
    };
};

export default useFetchReferralLink;
