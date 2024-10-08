//useTodayBattleSpinner.ts is used for calling the battlespinner api
import { useState, useCallback } from 'react';

interface Response {
    spinnerUrl: string;
    metadata: string;
    emoji1: string;
    emoji2: string;
    battleId: string;
}

interface UseTdyBatSpinnerReturn {
    error: string | null;
    loading: boolean;
    fetchTodayBattleSpinner: () => Promise<Response | null>;
}

export const useTodayBattleSpinner = (): UseTdyBatSpinnerReturn => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    //fetchTodayBattleSpinner to is used for fetching today battle spinner
    const fetchTodayBattleSpinner = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/battlespinner`);
            const data = await response.json();
            if (response.ok) {
                setError(null);
                if (data) {
                    return data;
                }
                return null;
            } else {
                throw new Error(data.message || 'Error fetching votes');
            }
        } catch (err) {
            setError('Error fetching today battle spinner');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        error,
        loading,
        fetchTodayBattleSpinner
    };
};
