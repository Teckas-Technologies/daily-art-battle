"use client";
import React, { useState, useEffect } from "react";
import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import CampaignForm from "./components/CampaignForm";
import CampaignTable from "./components/CampaignList";

const Admin: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const { fetchCampaign, deleteCampaignById, updateCampaignById } = useFetchCampaignByTitle();

  // Fetch all campaigns on component mount
  const fetchCampaigns = async () => {
    try {
      const result = await fetchCampaign();
      if (result) {
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
    setEditingCampaign(null); // Reset the editing campaign
  };

  // Handle form close event
  const handleFormClose = () => {
    setShowForm(false);
    setEditingCampaign(null); // Reset the editing campaign
  };

  // Handle edit button click
  const handleEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCampaignById(id);
      console.log(result);
      if (result) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
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
            <CampaignForm onCampaignSaved={handleCampaignSaved} onClose={handleFormClose} campaign={editingCampaign} />
          ) : (
            <CampaignTable 
              campaigns={campaigns} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
