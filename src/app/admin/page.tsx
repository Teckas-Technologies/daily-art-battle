"use client";
import { useFetchCampaignByTitle,CampaignData } from "@/hooks/campaignHooks";
import React, { useEffect, useState ,useRef} from "react";

const Admin: React.FC = () => {
  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignTheme: "",
    campaignWelcomeText: "",
    color: "#000000",
    video: ""
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const { saveCampaign,fetchCampaign } = useFetchCampaignByTitle();


  const getCampaigns = async () => {
    try {
      const result = await fetchCampaign();
        setCampaigns(result); // Assuming result.data contains the campaigns
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };
  useEffect(() => {
    getCampaigns();
  }, []);

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = event.target;
    if (id === "video" && files) {
      const file = files[0];
      convertToBase64(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  // Convert video file to Base64
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1]; // Remove the prefix
      setFormData((prevData) => ({
        ...prevData,
        video: base64Content,
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await saveCampaign(formData);
    console.log(res);
    if(res.success){
      await getCampaigns();
      setFormData({
        campaignTitle: "",
        campaignTheme: "",
        campaignWelcomeText: "",
        color:"#000000",
        video: ""
      });
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className=" w-full bg-white">
          <form className="py-4 px-9" onSubmit={handleSubmit}>
            <div className="mb-6 pt-4">
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                Create campaign
              </label>
              <div className="mb-5">
                <label htmlFor="campaignTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Campaign Url
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <span className="px-2 text-gray-900 dark:text-white">gfxvs.com/</span>
                  <input
                    type="text"
                    id="campaignTitle"
                    value={formData.campaignTitle}
                    onChange={handleChange}
                    required
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="campaignTheme" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Theme Title
                </label>
                <input
                  type="text"
                  id="campaignTheme"
                  value={formData.campaignTheme}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="campaignWelcomeText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Welcome Text
                </label>
                <input
                  type="text"
                  id="campaignWelcomeText"
                  value={formData.campaignWelcomeText}
                  onChange={handleChange}
                  required
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="color" className="block mt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Font color
                </label>
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="block w-full h-10 p-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="video" className="block text-black mt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Video
                </label>
                <input
                  type="file"
                  id="video"
                  ref={videoInputRef}
                  onChange={handleChange}
                  className="block w-full text-black h-10 p-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Submit
            </button>
          </form>
        </div>
 
      </div>
      <div className="mt-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Welcome Text</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {campaign.video ? <a href={`data:video/mp4;base64,${campaign.video}`} target="_blank" rel="noopener noreferrer">Video</a> : "No Video"}
                </td>
              </tr>
            ))}
          </tbody>  
        </table>
      </div>
    </>
  );
};

export default Admin;
