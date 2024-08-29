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
    campaignTitle: "",
    campaignTheme: "",
    campaignWelcomeText: "",
    color: "#000000",
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
        campaignTitle: campaign.campaignTitle || "",
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
          formData.campaignTitle
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
          campaignTitle: "",
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
      style={{ width: "100vw" }}
    >
      <div
        className="bg-white p-4 rounded-lg"
        style={{
          maxWidth: "330px",
          border: "2px dotted #3deb34",
          height: "auto",
          position: "relative",
          maxHeight: "95vh",
          overflow: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <form className="py-4" onSubmit={handleSubmit}>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              {campaign ? "Edit Campaign" : "Create Campaign"}
            </label>
            {/* Form Fields */}
            <div className="mb-5">
              <label
                htmlFor="campaignTitle"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Campaign Url
              </label>
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
            <div className="mb-5">
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
            <div className="mb-5">
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
            <div className="mb-5">
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
                className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
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
                className="block w-full text-black py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500"
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
            <div className="mb-5">
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
            <div className="mb-5">
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
            className={`mt-4 ml-10 px-4 py-2 bg-blue-500 text-white rounded-lg ${disable?'cursor-not-allowed':""}`}
          >
            {( loading) ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-10 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : campaign ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;
