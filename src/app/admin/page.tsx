"use client";
import React, { useState, useEffect } from "react";
import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import CampaignForm from "./components/CampaignForm";
import CampaignTable from "./components/CampaignList";
import { NearWalletConnector } from "@/components/NearWalletConnector";
const Admin: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const { fetchCampaign, deleteCampaignById, updateCampaignById } = useFetchCampaignByTitle();
  const [hasnext, setHasNext] = useState(false);
 const [page, setPage] = useState(1);


  // Fetch all campaigns on component mount
  const fetchCampaigns = async (val:any) => {
    try {
      console.log(page);
      const result = await fetchCampaign(val);
      console.log(result);
      if (result) {
        if (page > result.totalPages - 1) {
          setHasNext(true);
        } else {
          setHasNext(false);
        }
        setCampaigns(result.campaign); // Assuming result.data contains the campaigns
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  //  fetchCampaigns(page + 1);
  };
  
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
   //   fetchCampaigns(page - 1);
    }
  };
   

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  // Handle campaign saved event from form
  const handleCampaignSaved = () => {
    fetchCampaigns(page);
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
        fetchCampaigns(page);
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
      <video autoPlay muted loop id="background-video" style={{ 
    position: 'fixed', 
    right: 0, 
    bottom: 0, 
    objectFit: 'cover', 
    minWidth: '100%', 
    minHeight: '100%', 
    zIndex: -1,
    filter: 'blur(5px) brightness(50%)'
}}>
    <source src="images/back.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>
        <div className="w-full">
      
          {showForm ? (
            <CampaignForm onCampaignSaved={handleCampaignSaved} onClose={handleFormClose} campaign={editingCampaign} />
          ) : (
            <>
               <NearWalletConnector/>
               <div className="mt-[70px]">
               <h2 className="mt-10 text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center">
       Campaign creation
      </h2>
      <p className="battle-table1 md:ml-8 md:mr-8 lg:ml-20 lg:mr-20 my-12 w-full overflow-x-auto text-center text-white font-mono mt-5 sm:font-thin md:text-lg">
       
      Unleash your creativity and impact! Start your own campaign today by clicking the 'Add Campaign' button below. Share your vision, rally supporters, and drive meaningful change. Your campaign could be the next big initiative that makes a difference!  </p>
       <div className="flex justify-center">
  <button
    onClick={() => setShowForm(!showForm)}
    className=" px-4 py-2 bg-blue-500 text-sm text-white rounded-lg"
  >
    {showForm ? "Show Campaigns" : "Add Campaign"}
  </button>
</div>

            <CampaignTable 
              campaigns={campaigns} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
            </div>
            <nav className="flex justify-center flex-wrap gap-5 mt-2 mb-10 pb-3">
          <p
            className={`shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              page <= 1
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </p>
          <p
            className={` shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              hasnext
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={hasnext ? undefined : handleNext}
          >
            Next
            </p>
        </nav>
</>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;