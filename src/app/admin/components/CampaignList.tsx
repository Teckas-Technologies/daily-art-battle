// CampaignTable.tsx
import React from "react";

const CampaignTable: React.FC<{ campaigns: any[] }> = ({ campaigns }) => {
  return (
    <div className="mt-8">
      <table className=" min-w-full divide-y divide-gray-200">
        <thead className=" border bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Welcome Text</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign.campaignTitle}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.campaignTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.campaignTheme}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.campaignWelcomeText}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="w-6 h-6" style={{ backgroundColor: campaign.color }}></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.startDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.endDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {campaign.video ? "Video"  : "No Video"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
