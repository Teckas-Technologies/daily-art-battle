import { useState } from "react";
import { fetchWithAuth } from "../../utils/authToken";

export const useOffChainBurn = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);

    const offchainBurn = async (raffleId: string, queryType: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetchWithAuth(`/api/burn?queryType=${queryType}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raffleId: raffleId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }

            const responseData = await response.json();
            console.log("Response Data >> ", responseData);

            setSuccess(true);
            return responseData;
        } catch (error) {
            console.error('Error saving data:', error);
            setError('Failed to save data');
            return { message: "failed" }
        } finally {
            setLoading(false);
        }
    };

    return { offchainBurn, loading, error, success };
};