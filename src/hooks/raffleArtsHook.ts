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

export const useSearchRaffleArts = () => {
    const [searchedArts, setArts] = useState<ArtData[]>([]);
    const [totalSearchPage, setTotalPage] = useState<any>();
    const [searchLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchRaffleArts = async (searchText: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/raffleTicket?queryType=search&queryFilter=artName&arttitle=${searchText}&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log(" search data:", data)

            const updatedEntries = [];
            for (const entry of data.raffleEntries) {
                const { artDetails, ...rest } = entry; // Destructure to separate artDetails and other fields
                const updatedEntry = {
                    ...rest,
                    arttitle: artDetails?.arttitle || '',
                    colouredArt: artDetails?.colouredArt || '',
                    colouredArtReference: artDetails?.colouredArtReference || '',
                };
                updatedEntries.push(updatedEntry);
            }
            setArts(updatedEntries);
            setTotalPage(data.totalPages)
            return data?.arts;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { searchedArts, totalSearchPage, searchLoading, error, searchRaffleArts };
}