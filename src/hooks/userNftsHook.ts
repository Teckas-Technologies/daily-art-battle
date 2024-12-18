import { useState } from "react";
import { ArtData } from "./artHooks";
import { NftToken } from "@/types/types";

export const useFetchUserRareNfts = () => {
    const [arts, setArts] = useState<NftToken[]>([]);
    const [totalPage, setTotalPage] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserRareNfts = async (sort: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/userNfts?queryType=spinners&sort=${sort}&offset=${page - 1}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
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

    return { arts, totalPage, loading, error, fetchUserRareNfts };
}

export const useFetchParticipantsNfts = () => {
    const [arts, setArts] = useState<NftToken[]>([]);
    const [totalPage, setTotalPage] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchParticipantNfts = async (sort: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/userNfts?sort=${sort}&offset=${page - 1}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("DATA:::", data)
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

    return { arts, totalPage, loading, error, fetchParticipantNfts };
}