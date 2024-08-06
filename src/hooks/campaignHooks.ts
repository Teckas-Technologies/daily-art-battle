import { useState, useEffect } from 'react';

export interface CampaignData {
  _id: string;
  campaignTitle: string;
  campaignTheme: string;
  campaignWelcomeText: string;
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
  
        
       
  
    return {fetchCampaignByTitle};
      }
