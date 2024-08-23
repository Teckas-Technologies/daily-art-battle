import { useState, useEffect } from 'react';




export interface CampaignData {
  _id: string;
  campaignTitle: string;
  campaignTheme: string;
  campaignWelcomeText: string;
  color:string;
  video:string;
  startDate:string;
  endDate:string;
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

        const fetchCampaign = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/campaign?queryType=campaigns`);
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
  
        
       
  
    return {fetchCampaignByTitle,saveCampaign,fetchCampaign,deleteCampaignById,updateCampaignById};
      }