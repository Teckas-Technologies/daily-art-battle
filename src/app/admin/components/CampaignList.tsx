import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { NearWalletConnector } from "@/components/NearWalletConnector";
import Image from "next/image";

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
    <div className=" overflow-x-auto w-full">
 
 <section id="campaigns">
    <div className="battle-table  md:ml-8 md:mr-8 lg:ml-20 lg:mr-20 flex flex-col items-center">
    
      <div className=" pb-10 w-full overflow-x-auto">
        <div className="flex items-center justify-between">
          <div className="px-5 w-full">
            <table className="min-w-full mt-4 overflow-hidden ">
              <thead>
                <tr className="text-xs md:text-2xl sm:text-xl">
                  <th
                    className="text-center  font-normal text-white"
                    style={{
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  >
                    Logo
                  </th>
                  <th className="text-center  font-normal text-white">
                Url
                  </th>
                  <th
                  
                    className="text-white text-center cursor-pointer font-normal"
                  >
                    <span className="flex items-center justify-center ">
                         Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-96">
                {campaigns.map((campaign, index) => (
                  <>
                    <br />
                    <tr
                      key={index}
                      className="bg-white overflow-y-auto max-h-96"
                      style={{
                        borderTopLeftRadius: 40,
                        borderBottomLeftRadius: 40,
                      }}
                    >
                      <td
                        className="p-0 w-24 h-24 sm:w-36 sm:h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
                        style={{
                          borderTopLeftRadius: 40,
                          borderBottomLeftRadius: 40,
                        }}
                      >
                        <div
                          className="bg-white h-full w-full"
                          style={{ borderRadius: 40 }}
                        >
                            <div
                              className="relative w-full h-full"
                              style={{
                                borderTopLeftRadius: 40,
                                borderBottomLeftRadius: 40,
                              }}
                            >
                              <Image
                                src={campaign.logo?(
                                  campaign.logo
                                ):(
                                 "/images/logo.png"
                                )}
                                alt={"Art"}
                                width={400} // Arbitrary value; the actual size will be controlled by CSS
                                height={400} // Arbitrary value; the actual size will be controlled by CSS
                                className="w-full h-full border object-cover rounded-l-3xl "
                                unoptimized
                                style={{
                                  height: "100%", // Ensuring the image takes the full height of its container
                                  aspectRatio: "1/1",
                                  boxShadow:
                                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                }}
                              />
                            </div>
                        </div>
                      </td>

                      <td className="px-4 py-2 text-xs sm:text-2xl font-medium break-words break-all text-black text-center special-winner">
                      <a href={`http://${window.location.host}/${campaign.campaignTitle}`} target="_blank" className="text-blue-500 hover:underline">
                  {campaign.campaignTitle}
                </a>
                        <br />
                      </td>
                      <td
                        className="px-4 py-2 text-xs  sm:text-2xl font-medium break-words  break-all text-black text-center special-winner"
                        style={{
                          borderTopRightRadius: 20,
                          borderBottomRightRadius: 20,
                        }}
                      >
                      <p onClick={() => openModal(campaign)} className="text-blue-500 hover:underline mr-4">View</p>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </section>


      {/* <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="border bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">URL</th>
            <th className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td className="px-6 py-4 text-xs sm:text-base font-medium text-gray-900 break-words">
                <a href={`http://${window.location.host}/${campaign.campaignTitle}`} target="_blank" className="text-blue-500 hover:underline">
                  {campaign.campaignTitle}
                </a>
              </td>
              <td className="px-6 py-4 text-xs max-w-5 sm:max-w-full lg:max-w-full md:max-w-full sm:text-base text-gray-500 break-words">{campaign.campaignTitle}</td>
              <td className="px-6 py-4 text-xs sm:text-base text-gray-500 break-words">
                <button onClick={() => openModal(campaign)} className="text-blue-500 hover:underline mr-4">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      */}


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
