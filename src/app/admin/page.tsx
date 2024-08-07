// Admin.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import CampaignForm from "./components/CampaignForm";
import CampaignTable from "./components/CampaignList";

const Admin: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const { fetchCampaign } = useFetchCampaignByTitle();

  // Fetch all campaigns on component mount
  const fetchCampaigns = async () => {
    try {
      const result = await fetchCampaign();
      if (result) {
        console.log(result)
        setCampaigns(result); // Assuming result.data contains the campaigns
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle campaign saved event from form
  const handleCampaignSaved = () => {
    fetchCampaigns();
    setShowForm(false); // Hide the form after saving
  };

  // Handle form close event
  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full p-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {showForm ? "Show Campaigns" : "Add Campaign"}
          </button>
          {showForm ? (
            <CampaignForm onCampaignSaved={handleCampaignSaved} onClose={handleFormClose} />
          ) : (
            <CampaignTable campaigns={campaigns} />
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
