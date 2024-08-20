import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import React, { useRef, useState, useEffect } from "react";

interface CampaignFormProps {
  onCampaignSaved: () => void;
  onClose: () => void;
  campaign?: any; // Add optional campaign prop
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onCampaignSaved, onClose, campaign }) => {
  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignTheme: "",
    campaignWelcomeText: "",
    color: "#000000",
    video: "",
    startDate: "",
    endDate: ""
  });

  const videoInputRef = useRef<HTMLInputElement>(null);
  const { saveCampaign, updateCampaignById,fetchCampaignByTitle } = useFetchCampaignByTitle();
  const[loading,setLoading] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        campaignTitle: campaign.campaignTitle || "",
        campaignTheme: campaign.campaignTheme || "",
        campaignWelcomeText: campaign.campaignWelcomeText || "",
        color: campaign.color || "#000000",
        video: campaign.video || "",
        startDate: campaign.startDate || "",
        endDate: campaign.endDate || ""
      });
    }
  }, [campaign]);

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

  
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1]; 
      setFormData((prevData) => ({
        ...prevData,
        video: base64Content,
      }));
    };
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let res;
    try {
      if (campaign) {
        setLoading(true);
         res = await updateCampaignById(campaign._id, formData);
         setLoading(false)
        console.log(res);
      } else {
        setLoading(true);
         const campaign = await fetchCampaignByTitle(formData.campaignTitle);
         if(campaign){
          alert("campaign url already exist")
          setLoading(false)
         }else{
         res = await saveCampaign(formData);
         setLoading(false)
         }
        console.log(res);
      }

      if (res) {
        onCampaignSaved(); 
        setFormData({
          campaignTitle: "",
          campaignTheme: "",
          campaignWelcomeText: "",
          color: "#000000",
          video: "",
          startDate: "",
          endDate: ""
        });
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Failed to save campaign:", error);
    }
  };

  return (
    <div className="navbar fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ width: '100vw' }}>
      <div className="bg-white p-4 rounded-lg" style={{ maxWidth: '330px', border: '2px dotted #3deb34', height: 'auto', position: 'relative', maxHeight: '95vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
        <form className="py-4" onSubmit={handleSubmit}>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">{campaign ? "Edit Campaign" : "Create Campaign"}</label>
            {/* Form Fields */}
            <div className="mb-5">
              <label htmlFor="campaignTitle" className="block mb-2 text-sm font-medium text-gray-900">Campaign Url</label>
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 text-xs">
                <span className="px-2 text-gray-900">gfxvs.com/</span>
                <input
                  type="text"
                  id="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleChange}
                  required
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="campaignTheme" className="block mb-2 text-sm font-medium text-gray-900">Theme Title</label>
              <input
                type="text"
                id="campaignTheme"
                value={formData.campaignTheme}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="campaignWelcomeText" className="block mb-2 text-sm font-medium text-gray-900">Welcome Text</label>
              <input
                type="text"
                id="campaignWelcomeText"
                value={formData.campaignWelcomeText}
                onChange={handleChange}
                required
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900">Font color</label>
              <input
                type="color"
                id="color"
                value={formData.color}
                onChange={handleChange}
                className="block w-full h-10 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="video" className="block text-black mb-2 text-sm font-medium text-gray-900">Background Video</label>
              <input
                type="file"
                id="video"
                ref={videoInputRef}
                onChange={handleChange}
                className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="startDate" className="block text-black mb-2 text-sm font-medium text-gray-900">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="endDate" className="block text-black mb-2 text-sm font-medium text-gray-900">End Date</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
              />
            </div>
          </div>
          <button type="button" onClick={onClose} className="ml-5 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
            Cancel
          </button>
          <button type="submit" className="mt-4 ml-10 px-4 py-2 bg-blue-500 text-white rounded-lg">
          {loading ? (
            <div role="status">
            <svg aria-hidden="true" className="w-10 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
            ) : (
              campaign ? "Update" : "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;