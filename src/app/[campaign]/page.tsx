"use client";
import { NearWalletConnector } from "@/components/NearWalletConnector";
import { useFetchCampaignByTitle,CampaignData} from "@/hooks/campaignHooks";
import { useEffect, useState } from "react";
const Campaign = ({ params }: { params: { campaign: string } }) => {
    const [campaign,setCampaign] = useState<CampaignData>();
    const {fetchCampaignByTitle}= useFetchCampaignByTitle();
    useEffect(()=>{
        const fetchData =async()=>{
            const data = await fetchCampaignByTitle(params.campaign);
            setCampaign(data);
        }
        fetchData();
    },[params.campaign]);
    return(
        <>
        <NearWalletConnector/>
        <h1>{campaign?.campaignTheme}</h1>
        <h1>{campaign?.campaignWelcomeText}</h1>
        {params.campaign}
        </>
    )
}
export default Campaign;