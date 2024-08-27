"use client"
import React, { useState,useEffect } from "react";
import { CampaignData,useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import { NearWalletConnector } from "@/components/NearWalletConnector";

const CampaignTable: React.FC< void> = () => {
 const[campaigns,setCampaign] = useState<CampaignData[]>([]);
 const {fetchAllCampaign} = useFetchCampaignByTitle();


 const fetchCampaign=async()=>{
 const res =  await fetchAllCampaign();
  setCampaign(res);
 }

 useEffect(() => {
  fetchCampaign();
 }, [])
 

  return (
    <div>
       <NearWalletConnector />
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center">
         Campaigns
        </h2>
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="border bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">URL</th>
            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">Title</th>
            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">End Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td className="px-4 py-2 text-xs sm:text-base font-medium text-gray-900 break-words">
                <a href={`http://${window.location.host}/${campaign.campaignTitle}`} target="_blank" className="text-blue-500 hover:underline">
                  {campaign.campaignTitle}
                </a>
              </td>
              <td className="px-4 py-2 text-xs max-w-5 sm:max-w-full lg:max-w-full md:max-w-full sm:text-base text-gray-500 break-words">{campaign.campaignTitle}</td>
              <td className="px-4 py-2 text-xs sm:text-base text-gray-500 break-words">
               {campaign.endDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default CampaignTable;
