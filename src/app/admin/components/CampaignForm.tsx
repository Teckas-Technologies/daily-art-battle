import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import React, { useRef, useState, useEffect } from "react";
import { useMbWallet } from "@mintbase-js/react";

interface CampaignFormProps {
  onCampaignSaved: () => void;
  onClose: () => void;
  campaign?: any;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  onCampaignSaved,
  onClose,
  campaign,
}) => {
  const [formData, setFormData] = useState({
    campaignUrl: "",
    campaignTheme: "",
    campaignWelcomeText: "",
    color: "#FFFFFF",
    video: "",
    startDate: "",
    endDate: "",
    logo: "",
    creatorId:"",
  });

  const [disable,setDisabled] = useState(false);
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const {
    saveCampaign,
    updateCampaignById,
    fetchCampaignByTitle,
    uploadMediaToAzure,
  } = useFetchCampaignByTitle();
  const [loading, setLoading] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        campaignUrl: campaign.campaignUrl || "",
        campaignTheme: campaign.campaignTheme || "",
        campaignWelcomeText: campaign.campaignWelcomeText || "",
        color: campaign.color || "#000000",
        video: campaign.video || "",
        startDate: campaign.startDate || "",
        endDate: campaign.endDate || "",
        logo: campaign.logo || "",
        creatorId : campaign.creatorId || ""
      });
    }
  }, [campaign]);

  const handleChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = event.target;
    if (files && (id === "video" || id === "logo")) {
      const file = files[0];
      setDisabled(true);
      if (id === "video") {
        setLoadingVideo(true);
      } else if (id === "logo") {
        setLoadingLogo(true);
      }
      const url = await uploadMediaToAzure(file);
      console.log(url)
      setFormData((prevData) => ({
        ...prevData,
        [id]: url,
      }));
      if (id === "video") {
        setLoadingVideo(false);
      } else if (id === "logo") {
        setLoadingLogo(false);
      }
      setDisabled(false);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let res;
    try {
      setLoading(true);
      if (campaign) {
        res = await updateCampaignById(campaign._id, formData);
      } else {
        const existingCampaign = await fetchCampaignByTitle(
          formData.campaignUrl
        );
        if (existingCampaign) {
          alert("Campaign URL already exists");
          setLoading(false);
          return;
        }
        formData.creatorId = activeAccountId as string;
        res = await saveCampaign(formData);
      }
      setLoading(false);

      if (res) {
        onCampaignSaved();
        setFormData({
          campaignUrl: "",
          campaignTheme: "",
          campaignWelcomeText: "",
          color: "#000000",
          video: "",
          startDate: "",
          endDate: "",
          logo: "",
          creatorId : ""
        });
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (logoInputRef.current) logoInputRef.current.value = "";
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to save campaign:", error);
    }
  };

  return (
    <div
      className="navbar fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ width: "100vw", height:"100vh" }}
    >
      <div
        className="bg-white p-4 rounded-lg"
        style={{
          width: "100vw",
          border: "2px dotted #3deb34",
          height: "auto",
          position: "relative",
          maxHeight: "100vh",
          overflow: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <form className="py-4" onSubmit={handleSubmit}>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              {campaign ? "Edit Campaign" : "Create Campaign"}
            </label>
            {/* Responsive Form Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="mb-5">
                <label
                  htmlFor="campaignUrl"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Campaign Url
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 text-xs max-w-md">
                  <span className="px-2 text-gray-900">gfxvs.com/</span>
                  <input
                    type="text"
                    id="campaignUrl"
                    value={formData.campaignUrl}
                    onChange={handleChange}
                    required
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
                  />
                </div>
              </div>
  
              <div className="mb-5 max-w-md">
                <label
                  htmlFor="campaignTheme"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Theme Title
                </label>
                <input
                  type="text"
                  id="campaignTheme"
                  value={formData.campaignTheme}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                />
              </div>
  
              <div className="mb-5 max-w-md">
                <label
                  htmlFor="campaignWelcomeText"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Welcome Text
                </label>
                <input
                  type="text"
                  id="campaignWelcomeText"
                  value={formData.campaignWelcomeText}
                  onChange={handleChange}
                  required
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500"
                />
              </div>
  
              <div className="mb-5 max-w-md">
                <label
                  htmlFor="color"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Font color
                </label>
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="block w-full h-10 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
                />
              </div>
  
              <div className="mb-5 max-w-md">
                <label
                  htmlFor="video"
                  className="block text-black mb-2 text-sm font-medium text-gray-900"
                >
                  Background Img or Video
                </label>
                <input
                  type="file"
                  id="video"
                  ref={videoInputRef}
                  onChange={handleChange}
                  className="block max-w-md w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
                />
                {loadingVideo && (
                  <div role="status" className="ml-2">
                    {/* Loading spinner */}
                  </div>
                )}
              </div>
  
              <div className="mb-5">
                <label
                  htmlFor="logo"
                  className="block text-black mb-2 text-sm font-medium text-gray-900"
                >
                  Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  ref={logoInputRef}
                  onChange={handleChange}
                  className="block w-full max-w-md text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
                />
                {loadingLogo && (
                  <div role="status" className="ml-2">
                    {/* Loading spinner */}
                  </div>
                )}
              </div>
  
              <div className="mb-5 max-w-md">
                <label
                  htmlFor="startDate"
                  className="block text-black mb-2 text-sm font-medium text-gray-900"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
                />
              </div>
  
              <div className="mb-5 max-w-md">
                <label
                  htmlFor="endDate"
                  className="block text-black mb-2 text-sm font-medium text-gray-900"
                >
                  End Date
                </label>
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
  
            <button
              type="button"
              onClick={onClose}
              className="ml-5 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disable}
              className={`mt-4 ml-10 px-4 py-2 bg-blue-500 text-white rounded-lg ${disable ? 'cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div role="status">
                  {/* Loading spinner */}
                </div>
              ) : campaign ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}  
  

export default CampaignForm;
