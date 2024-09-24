import { useState, useEffect } from 'react';
import axios from "axios";



export interface CampaignData {
  _id: string;
  campaignUrl: string;
  campaignTheme: string;
  campaignWelcomeText: string;
  color:string;
  video:string;
  startDate:string;
  endDate:string;
  logo:string;
  creatorId:string;
}

export const useFetchCampaignByTitle = () => {
    const [campaign, setCampaign] = useState<CampaignData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
  
        const fetchCampaignByTitle = async (title:any) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/campaign?title=${title}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                
                setCampaign(res.data);
                return res.data;
            } catch (err) {
                console.error('Error fetching art:', err);
                setError("Error fetching art!");
            } finally {
                setLoading(false);
            }
        };

        const fetchCampaign = async (page: number, limit: number = 10) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/campaign?queryType=campaigns&page=${page}&limit=${limit}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                
                setCampaign(res.data);
                return res.data;
            } catch (err) {
                console.error('Error fetching art:', err);
                setError("Error fetching art!");
            } finally {
                setLoading(false);
            }
        };


        const fetchAllCampaign = async (page: number, limit: number = 10) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/campaign?queryType=campaignsAll&page=${page}&limit=${limit}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                
                setCampaign(res.data);
                return res.data;
            } catch (err) {
                console.error('Error fetching art:', err);
                setError("Error fetching art!");
            } finally {
                setLoading(false);
            }
        };

        const deleteCampaignById = async (id:any) => {
            console.log("delete")
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/campaign?id=${id}`,{
                    method:"DELETE"
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                
                setCampaign(res.data);
                return res.data;
            } catch (err) {
                console.error('Error deleting art:', err);
                setError("Error deleting art!");
            } finally {
                setLoading(false);
            }
        };

        
        const updateCampaignById = async (id:any,data:any) => {
            setLoading(true);
            setError(null);
            console.log("update")
            try {
                const response = await fetch(`/api/campaign?id=${id}`,{
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                console.log(res);
                setCampaign(res.data);
                return res.data;
            } catch (err) {
                console.error('Error updating art:', err);
                setError("Error updating art!");
            } finally {
                setLoading(false);
            }
        };

    
  
        const saveCampaign = async (data:any) => {
            setLoading(true);
            setError(null);
            try {
                console.log(data);
                const response = await fetch(`/api/campaign`,{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                const res = await response.json();
                return res;
            } catch (err) {
                console.error('Error saving art:', err);
                setError("Error saving art!");
            } finally {
                setLoading(false);
            }
        };

       

const uploadMediaToAzure = async (file: File): Promise<string> => {
    try {
        // Step 1: Get the SAS token from the backend
        const response = await axios.get('/api/generateSasToken');
        console.log(response.data);
        const { blobUrl } = response.data;

        // Step 2: Upload the file using the SAS token
       const res = await axios.put(blobUrl, file, {
            headers: {
                "x-ms-blob-type": "BlockBlob",
                "Content-Type": file.type
            }
        });
        return blobUrl.split('?')[0];
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error);
        throw error;
    }
};  
  
return {fetchCampaignByTitle,saveCampaign,fetchCampaign,deleteCampaignById,updateCampaignById,uploadMediaToAzure,fetchAllCampaign};
}