import { useState } from "react";
import { fetchWithAuth } from "../../utils/authToken";

interface AnalyticsData {
    participationCount: number;
    rareNftCount: number;
    raffleCount: number;
}

export const useFetchArtsAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchArtsAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/profileAnalytics`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const participationCount = data.participationCount?.data?.mb_views_nft_tokens_aggregate?.aggregate?.count || 0;
            const rareNftCount = data.rareNftCount?.data?.mb_views_nft_tokens_aggregate?.aggregate?.count || 0;
            const raffleCount = data.rafleCount || 0;
            setAnalytics({ participationCount, rareNftCount, raffleCount });
            return { participationCount, rareNftCount, raffleCount };
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { analytics, loading, error, fetchArtsAnalytics };
}