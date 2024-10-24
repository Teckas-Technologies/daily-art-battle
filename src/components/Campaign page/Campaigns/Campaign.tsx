"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./Campaign.css";
import InlineSVG from "react-inlinesvg";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
}
const CampaignBanner = () => {
  const campaigns = Array(10).fill({
    name: "Raghuvaran's Campaign",
    startDate: "12 Oct 2024",
    endDate: "18 Oct 2024",
    rewards: 4567,
  });
  const MOBILE_LIMIT = 4;
  const DESKTOP_LIMIT = 6;
  const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);
  const { battles, error, loading, fetchMoreBattles, totalPage } =
    useFetchBattles();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MOBILE_LIMIT);
  const handlePageClick = (pageNumber: number) => {
    console.log(`${pageNumber}, ${page}`);
    if (pageNumber !== page) {
      setPage(pageNumber);
      const limit = getLimitBasedOnScreenSize();
      // fetchMoreBattles(campaignId, sort, page, limit);
      setLimit(limit);

      const previousSection = document.getElementById("previous");
      if (previousSection) {
        const sectionPosition =
          previousSection.getBoundingClientRect().top + window.scrollY;
        const isMobile = window.innerWidth < 768 ? true : false;
        const rem = isMobile ? 1 : 2.5;
        const offset = rem * 16;
        window.scrollTo({
          top: !isMobile ? sectionPosition + offset : sectionPosition - 20,
          behavior: "smooth",
        });
      }
    }
  };
  const renderPageNumbers = () => {
    const pagesToShow = 5;
    let startPage = Math.max(1, page - 2); // Center the current page
    let endPage = Math.min(totalPage, page + 2); // Show up to 5 pages

    if (endPage - startPage + 1 < pagesToShow) {
      // Adjust start and end if less than 5 pages are displayed
      if (startPage === 1) {
        endPage = Math.min(totalPage, pagesToShow);
      } else if (endPage === totalPage) {
        startPage = Math.max(1, totalPage - pagesToShow + 1);
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      const limit = getLimitBasedOnScreenSize();
      setLimit(limit);

      const previousSection = document.getElementById("previous");
      if (previousSection) {
        const sectionPosition =
          previousSection.getBoundingClientRect().top + window.scrollY;
        const isMobile = window.innerWidth < 768 ? true : false;
        const rem = isMobile ? 1 : 2.5;
        const offset = rem * 16;
        window.scrollTo({
          top: !isMobile ? sectionPosition + offset : sectionPosition - 20,
          behavior: "smooth",
        });
      }
    }
  };

  const getLimitBasedOnScreenSize = () => {
    // Set the limit based on the window width
    return window.innerWidth < 768 ? MOBILE_LIMIT : DESKTOP_LIMIT;
  };
  const handleNext = () => {
    if (page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      const limit = getLimitBasedOnScreenSize();
      setLimit(limit);

      const previousSection = document.getElementById("previous");
      if (previousSection) {
        const sectionPosition =
          previousSection.getBoundingClientRect().top + window.scrollY;
        const isMobile = window.innerWidth < 768 ? true : false;
        const rem = isMobile ? 1 : 2.5;
        const offset = rem * 16;
        window.scrollTo({
          top: !isMobile ? sectionPosition + offset : sectionPosition - 20,
          behavior: "smooth",
        });
      }
    }
  };
  const [path, setPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const urlParts = currentPath.split("/").slice(1);
      setPath(urlParts.join("/"));
    }
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const router = useRouter();
  const handleCreateCampaign = () => {
    router.push("/campaign/create");
  };
  const handleUpcomingCampaign = () => {
    router.push("/campaign/upcoming");
  };
  const handleCurrentCampaign = () => {
    router.push("/campaign/current");
  };
  return (
    <div className="campaign-container">
       <InlineSVG src="/icons/blur-effect.svg" className="effect"></InlineSVG>
      <div
        className="flex gap-2 items-center camapign-path"
        style={{ paddingTop: "80px" }}
      >
        <button className="camapign-path-button">GFXvs</button>
        <InlineSVG src="/icons/green-arrow.svg" style={{ fill: "#00ff00" }} />
        <h3
          style={{
            color: "#00ff00",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Campaigns
        </h3>
      </div>
      <div className="campaign-header">
        <div className="campaign-content">
          <h1 className="campaign-title">GFXvs Campaigns</h1>
          <p className="campaign-description md:w-[480px]">
            Create campaigns publicly or among your friends, participate in the
            campaigns and win exclusive rewards
          </p>
        </div>
        <div className="campaign-btn-Wrapper">
          <button className="campaign-btn " onClick={handleCreateCampaign}>
            Create Campaign
          </button>

          <div className="campaign-btn-Border" />

          <div className="campaign-btn-Overlay" />
        </div>
      </div>

      <div className="button-table-container ">
       

        <div className="campaign-tabs">
          <button onClick={handleCurrentCampaign}>Current Campaigns</button>
          <button onClick={handleUpcomingCampaign}>Upcoming Campaigns</button>
          <button>Previous Campaigns</button>
          <button>My Campaigns</button>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div className="header-cell">Campaign Name</div>
            <div className="header-cell">Start Date</div>
            <div className="header-cell">End Date</div>
            <div className="header-cell">Rewards</div>
            <div className="header-cell"></div>
          </div>

          {campaigns.map((campaign, index) => (
            <div key={index} className="campaign-row">
              <div className="cell">{campaign.name}</div>
              <div className="cell">{campaign.startDate}</div>
              <div className="cell">{campaign.endDate}</div>
              <div className="cell">
                <span className="flex items-center justify-center gap-[5px]">
                  <InlineSVG
                    src="/icons/coin.svg"
                    className="w-[19.1px] h-[19.1px]"
                  />
                  {campaign.rewards}
                </span>
              </div>
              <div className="cell">
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-section relative w-full flex justify-center py-5">
        <div className="pagination rounded-[7rem]">
          <div className="w-auto flex items-center justify-center md:gap-[2rem] gap-[1rem] px-7 py-3 rounded-[7rem] bg-black">
            <div
              className={`previous flex items-center gap-1 ${
                page === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={page !== 1 ? handlePrevious : undefined}
            >
              <InlineSVG
                src="/icons/left-arrow.svg"
                className="w-3 h-3 spartan-light"
              />
              <h2 className="hidden md:block">Previous</h2>
            </div>
            <div className="page-numbers flex items-center justify-center gap-2">
              {renderPageNumbers().map((pageNumber) => (
                <div
                  key={pageNumber}
                  className={`page md:h-[3rem] md:w-[3rem] h-[2rem] w-[2rem] flex justify-center items-center ${
                    page === pageNumber ? "active" : "cursor-pointer"
                  }`}
                  onClick={() => handlePageClick(pageNumber)}
                >
                  <h2>{pageNumber}</h2>
                </div>
              ))}
            </div>
            <div
              className={`next flex items-center gap-1 ${
                page === totalPage
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={page !== totalPage ? handleNext : undefined}
            >
              <h2 className="hidden md:block">Next</h2>
              <InlineSVG
                src="/icons/right-arrow.svg"
                className="w-3 h-3 spartan-light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBanner;
