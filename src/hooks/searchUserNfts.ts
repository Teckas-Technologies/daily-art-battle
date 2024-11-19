import { useState } from "react";
import { fetchWithAuth } from "../../utils/authToken";
import { NftToken } from "@/types/types";

export const useSearchUserRareNfts = () => {
    const [searchedArts, setArts] = useState<NftToken[]>([]);
    const [totalSearchPage, setTotalPage] = useState<any>();
    const [searchLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchUserRareNfts = async (title: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/userNftsSearch?queryType=spinner&title=${title}&offset=${page - 1}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("data:", data)
            setArts(data.result.data.mb_views_nft_tokens);
            const totalDocuments = data.totalDocuments.data.mb_views_nft_tokens_aggregate.aggregate.count;
            const totalPages = Math.ceil(totalDocuments / limit);
            console.log(totalDocuments, totalPages)
            setTotalPage(totalPages);
            return data?.arts;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { searchedArts, totalSearchPage, searchLoading, error, searchUserRareNfts };
}


export const useSearchUserParticipationNfts = () => {
    const [searchedArts, setArts] = useState<NftToken[]>([]);
    const [totalSearchPage, setTotalPage] = useState<any>();
    const [searchLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchUserParticipationNfts = async (title: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`/api/userNftsSearch?title=${title}&offset=${page - 1}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("data:", data)
            setArts(data.result.data.mb_views_nft_tokens);
            const totalDocuments = data.totalDocuments.data.mb_views_nft_tokens_aggregate.aggregate.count;
            const totalPages = Math.ceil(totalDocuments / limit);
            console.log(totalDocuments, totalPages)
            setTotalPage(totalPages);
            return data?.arts;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { searchedArts, totalSearchPage, searchLoading, error, searchUserParticipationNfts };
}