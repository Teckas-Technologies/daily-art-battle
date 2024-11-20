import { useState } from "react";
import { fetchWithAuth } from "../../utils/authToken";
import { RaffleArt, SpinnerItem } from "@/types/types";

export const useFetchRaffleArts = () => {
    const [arts, setArts] = useState<RaffleArt[]>([]);
    const [totalPage, setTotalPage] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserRaffleArts = async (sort: string, page: number, limit: number = 8) => {
        setLoading(true);
        setError(null);
        console.log("Sort:", sort)
        try {
            const response = await fetchWithAuth(`/api/raffleTicket?queryType=${sort}&sort=voteAsc&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("data:", data);

            // Determine the response type and map if necessary
            if (Array.isArray(data.spinner)) {
                // Convert SpinnerItem[] to RaffleArt[]
                const mappedArts: RaffleArt[] = data.spinner.map((item: SpinnerItem) => ({
                    _id: item._id,
                    email: item.artAartistEmail ?? item.artBartistEmail ?? '',
                    participantId: item.artAartistId ?? item.artBartistId ?? '',
                    artId: item._id ?? '',
                    campaignId: item.campaignId ?? '',
                    raffleCount: 1,
                    isMintedNft: false,
                    createdAt: item.startTime ?? '',
                    updatedAt: item.endTime ?? '',
                    __v: 0,
                    colouredArt: item.grayScale ?? '',
                    colouredArtReference: item.grayScaleReference ?? '',
                }));

                setArts(mappedArts);
            } else if (Array.isArray(data.rafflesWithArtUrls)) {
                setArts(data.rafflesWithArtUrls);
            } else {
                throw new Error('Unexpected response format');
            }
            setTotalPage(data.totalPages);
            return;
        } catch (err) {
            setError("Error loading arts");
        } finally {
            setLoading(false);
        }
    };

    return { arts, totalPage, loading, error, fetchUserRaffleArts };
}

export const useSearchRaffleArts = () => {
    const [searchedArts, setArts] = useState<RaffleArt[]>([]);
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