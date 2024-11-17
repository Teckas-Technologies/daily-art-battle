import { useState } from "react";
import { ArtData } from "./artHooks";
import { fetchWithAuth } from "../../utils/authToken";

export const useFetchRaffleArts = () => {
    const [arts, setArts] = useState<ArtData[]>([]);
    const [totalPage, setTotalPage] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserRaffleArts = async (sort: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/raffleTicket?queryType=raffles&sort=${sort}&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("data:", data)
            setArts(data.rafflesWithArtUrls);
            setTotalPage(data.totalPages)
            return data?.rafflesWithArtUrls;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { arts, totalPage, loading, error, fetchUserRaffleArts };
}