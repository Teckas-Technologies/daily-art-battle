"use client";
import React, { useState, useEffect } from "react";
import { useFetchArts, ArtData } from "@/hooks/artHooks";
import "./UpcomingHeader.css";
const UpcomingHeader: React.FC<{
  toggleUploadModal: () => void;
  uploadSuccess: boolean;
  campaignId: string;
  fontColor: string;
}> = ({ toggleUploadModal, uploadSuccess, campaignId, fontColor }) => {
  const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { arts, totalPage, error, fetchMoreArts } = useFetchArts();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("dateDsc");

  //console.log(arts);
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortType = event.target.value;
    setSort(sortType);
    setPage(1); // Reset to first page when sorting
    fetchMoreArts(campaignId, sortType, 1);
  };

  useEffect(() => {
    const initializeData = async () => {
      fetchMoreArts(campaignId, sort, page);
    };
    const timeoutId = setTimeout(initializeData, 1000);

    return () => clearTimeout(timeoutId);
  }, [sort, page, refresh, uploadSuccess, fetchMoreArts]);

  const [hasnext, setHasNext] = useState(false);

  useEffect(() => {
    if (arts) {
      if (page <= totalPage - 1) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
    setUpcomingArts(arts);
  }, [arts]);

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
    fetchMoreArts(campaignId, sort, page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      fetchMoreArts(campaignId, sort, page - 1);
    }
  };

  return (
    <section id="upcoming-header">
      <div className="upcoming-header">
        <div className="content">
          <p className="upcoming-subHeading">UPVOTE YOUR FAVORITE ARTS</p>
          <div className="upcoming-heading spartan-bold">
            Upcoming <span>Art Battles</span>
          </div>

          <p className="description text-center text-xs md:text-base md:w-[600px] mx-auto mt-4">
            Upvote your favorite artworks to influence what will be up for
            battle next. Think you’ve got what it takes? Upload your own
            masterpiece and join the competition!
          </p>

          <div className="uploadButtonWrapper">
            <button onClick={toggleUploadModal}
              className="uploadButton px-4 md:mr-5 py-2 vote-btn text-black bg-white hover:bg-gray-300 rounded" 
              >Upload your Art</button>

            <div className="uploadButtonBorder" />

            <div className="uploadButtonOverlay" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingHeader;
