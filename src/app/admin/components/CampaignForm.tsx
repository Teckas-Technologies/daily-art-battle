import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import React, { useRef, useState, useEffect, useContext } from "react";
import { NearContext } from "@/wallet/WalletSelector";

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
  const { wallet, signedAccountId } = useContext(NearContext);
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
      }//66f2577f410bd8a94434fe3f 66f25823410bd8a94434fef1
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
        formData.creatorId = signedAccountId as string;
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
                     <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08167 50.5908C9.08167 73.1827 27.4081 91.5092 50 91.5092C72.5919 91.5092 90.9183 73.1827 90.9183 50.5908C90.9183 27.9988 72.5919 9.67238 50 9.67238C27.4081 9.67238 9.08167 27.9988 9.08167 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5531C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7236 75.2124 7.41289C69.5422 4.10219 63.2754 1.94025 56.7017 1.05126C51.7667 0.3679 46.7826 0.446057 41.888 1.27846C39.4174 1.69323 37.9924 4.19778 38.6295 6.62326C39.2667 9.04873 41.7569 10.4717 44.2295 10.1071C48.4302 9.459 52.7191 9.45903 56.9198 10.1071C61.7694 10.8623 66.4018 12.7185 70.4864 15.5528C74.5711 18.3872 78.0398 22.1336 80.654 26.582C82.8732 30.082 84.4804 33.8754 85.4169 37.818C86.0605 40.1759 88.5423 41.678 91.0011 41.0399L93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
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
                     <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08167 50.5908C9.08167 73.1827 27.4081 91.5092 50 91.5092C72.5919 91.5092 90.9183 73.1827 90.9183 50.5908C90.9183 27.9988 72.5919 9.67238 50 9.67238C27.4081 9.67238 9.08167 27.9988 9.08167 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5531C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7236 75.2124 7.41289C69.5422 4.10219 63.2754 1.94025 56.7017 1.05126C51.7667 0.3679 46.7826 0.446057 41.888 1.27846C39.4174 1.69323 37.9924 4.19778 38.6295 6.62326C39.2667 9.04873 41.7569 10.4717 44.2295 10.1071C48.4302 9.459 52.7191 9.45903 56.9198 10.1071C61.7694 10.8623 66.4018 12.7185 70.4864 15.5528C74.5711 18.3872 78.0398 22.1336 80.654 26.582C82.8732 30.082 84.4804 33.8754 85.4169 37.818C86.0605 40.1759 88.5423 41.678 91.0011 41.0399L93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
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
