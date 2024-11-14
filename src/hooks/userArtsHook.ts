import { useState } from "react";
import { ArtData } from "./artHooks";
import { fetchWithAuth } from "../../utils/authToken";

export const useFetchUserArts = () => {
    const [arts, setArts] = useState<ArtData[]>([]);
    const [totalPage, setTotalPage] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserArts = async (sort: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/userArts?queryType=uploadedArts&sort=${sort}&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("data:", data)
            setArts(data.arts);
            setTotalPage(data.totalPages)
            return data?.arts;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { arts, totalPage, loading, error, fetchUserArts };
}

export const useSearchUserArts = () => {
    const [searchedArts, setArts] = useState<ArtData[]>([]);
    const [totalSearchPage, setTotalPage] = useState<any>();
    const [searchLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchUserArts = async (searchText: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/userArts?queryType=search&queryFilter=artName&name=${searchText}&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("data:", data)
            setArts(data.arts);
            setTotalPage(data.totalPages)
            return data?.arts;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { searchedArts, totalSearchPage, searchLoading, error, searchUserArts };
}