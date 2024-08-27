import React, { useState } from "react";
import { useRouter } from 'next/navigation';
const CampaignTable: React.FC<{ campaigns: any[], onEdit: (campaign: any) => void, onDelete: (id: string) => void }> = ({ campaigns, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const router = useRouter();

  const openModal = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleOpen = () => {
     router.push(`/${selectedCampaign.campaignTitle}`);
  };

  return (
    <div className="mt-8 overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="border bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">URL</th>
            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">Title</th>
            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">Actions</th>
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
                <button onClick={() => openModal(campaign)} className="text-blue-500 hover:underline mr-4">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Campaign Details</h2>
            <p className="text-black text-sm sm:text-base"><strong>Title:</strong> {selectedCampaign.campaignTitle}</p>
            <p className="text-black text-sm sm:text-base"><strong>Theme:</strong> {selectedCampaign.campaignTheme}</p>
            <p className="text-black text-sm sm:text-base"><strong>Welcome Text:</strong> {selectedCampaign.campaignWelcomeText}</p>
            <p className="text-black text-sm sm:text-base"><strong>Color:</strong> <span className="inline-block w-6 h-6" style={{ backgroundColor: selectedCampaign.color }}></span></p>
            <p className="text-black text-sm sm:text-base"><strong>Start Date:</strong> {selectedCampaign.startDate}</p>
            <p className="text-black text-sm sm:text-base"><strong>End Date:</strong> {selectedCampaign.endDate}</p>
            <p className="text-black text-sm sm:text-base"><strong>Video:</strong> {selectedCampaign.video ? "Video" : "No Video"}</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button onClick={() => onEdit(selectedCampaign)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Edit</button>
              <button onClick={() => {
                  onDelete(selectedCampaign._id);
                  closeModal();
                }} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
               
                  <button onClick={handleOpen} className="px-4 py-2 bg-green-500 text-white rounded-lg">Open</button>
             

              <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;
