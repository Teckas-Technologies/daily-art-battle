// CampaignForm.tsx
import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import React, { useRef, useState } from "react";

const CampaignForm: React.FC<{ onCampaignSaved: () => void; onClose: () => void }> = ({ onCampaignSaved, onClose }) => {
  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignTheme: "",
    campaignWelcomeText: "",
    color: "#000000",
    video: "",
    startDate:"",
    endDate:""
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { saveCampaign } = useFetchCampaignByTitle();

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
    console.log(formData);
    const res = await saveCampaign(formData);
    console.log(res);
    if (res.success) {
      onCampaignSaved(); // Notify parent to refetch campaigns
      setFormData({
        campaignTitle: "",
        campaignTheme: "",
        campaignWelcomeText: "",
        color: "#000000",
        video: "",
        startDate:"",
        endDate:""
      });
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="navbar fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ width: '100vw' }}>
      <div className="bg-white p-4 rounded-lg" style={{ maxWidth: '330px  ', border: '2px dotted #3deb34', height: 'auto', position: 'relative', maxHeight: '95vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
        <form className="py-4" onSubmit={handleSubmit}>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">Create campaign</label>
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
                required
                onChange={handleChange}
                className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
              />
            </div>
          </div>
          <button type="button" onClick={onClose} className="ml-5 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
            Cancel
          </button>
          <button type="submit" className="mt-4 ml-10 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;
