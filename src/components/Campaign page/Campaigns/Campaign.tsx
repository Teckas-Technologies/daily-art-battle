"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./Campaign.css";
import InlineSVG from "react-inlinesvg";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
import useCampaigns from "@/hooks/CampaignHook";
import { useMbWallet } from "@mintbase-js/react";
interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
}
interface Campaign {
  campaignName: string;
  startDate: string;
  endDate: string;
  specialRewards: number;
  campaignUrl: string;
  creatorId: string;
}
interface CampaignBannerProps {
  idToken: string;
}
const CampaignBanner: React.FC<CampaignBannerProps> = ({ idToken }) => {
  const router = useRouter();
  const { activeAccountId, isConnected } = useMbWallet();
  const [activeTab, setActiveTab] = useState("Current Campaigns");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    campaignData,
    loading,
    totalPages,
    fetchCurrentCampaign,
    fetchUpcomingCampaigns,
    fetchPreviousCampaigns,
    fetchMyCampaigns,
  } = useCampaigns(idToken);

  const updateCampaigns = () => {
    switch (activeTab) {
      case "Current Campaigns":
        fetchCurrentCampaign(page, limit);
        break;
      case "Upcoming Campaigns":
        fetchUpcomingCampaigns(page, limit);
        break;
      case "Previous Campaigns":
        fetchPreviousCampaigns(page, limit);
        break;
      case "My Campaigns":
        fetchMyCampaigns(page, limit);
        break;
      default:
        fetchCurrentCampaign(page, limit);
    }
  };

  useEffect(() => {
    updateCampaigns();
  }, [activeTab, page, limit]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 3;
    let startPage = Math.max(1, page - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(/, /g, "");
  };

  const handleCreateCampaign = () => {
    router.push("/campaign/create");
  };

  const handleNavigation = () => {
    window.location.href = "/campaign";
  };
  
  return (
    <div className="campaign-container">
      <InlineSVG src="/icons/blur-effect.svg" className="effect"></InlineSVG>
      <div
          className="flex gap-1 items-center camapign-path md:mb-10"
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
          onClick={handleNavigation}
        >
          Campaigns
        </h3>
      </div>
      <div style={{}}>
        <div className="campaign-header">
          <div className="campaign-content">
            <h1 className="campaign-title">GFXvs Campaigns</h1>
            <p className="campaign-description md:w-[480px]">
              Create campaigns publicly or among your friends, participate in
              the campaigns and win exclusive rewards
            </p>
          </div>
          <div className="campaign-btn-Wrapper">
            <button className="campaign-btn " onClick={handleCreateCampaign}>
              Create Campaign
            </button>

            <div className="campaign-btn-Border" />

            <div className="campaign-btn-Overlay" ref={scrollRef} id="top" />
          </div>
        </div>
      </div>
      <div className="campaign-tabs">
        {[
          "Current Campaigns",
          "Upcoming Campaigns",
          "Previous Campaigns",
          "My Campaigns",
        ].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {campaignData && campaignData.length > 0 ? (
        <div className="table-container">
          <div className="table-header">
            <div className="header-cell">Campaign Name</div>
            <div className="header-cell">Start Date</div>
            <div className="header-cell">End Date</div>
            <div className="header-cell">Rewards</div>
            <div className="header-cell"></div>
          </div>

          {campaignData &&
            campaignData.length > 0 &&
            campaignData.map((item: Campaign, index: number) => (
              <div
                key={index}
                className={`campaign-row ${
                  item.creatorId === activeAccountId ? "creater-border" : ""
                }`}
              >
                <div className="cell">
                  {item.campaignName.length > 15
                    ? `${item.campaignName.substring(0, 15)}...`
                    : item.campaignName}
                </div>

                <div className="cell">{formatDate(item.startDate)}</div>
                <div className="cell">{formatDate(item.endDate)}</div>
                <div className="cell">
                  <span className="flex items-center justify-center gap-[5px]">
                    <InlineSVG
                      src="/icons/coin.svg"
                      className="w-[19.1px] h-[19.1px]"
                    />
                    {item.specialRewards}
                  </span>
                </div>
                <div className="cell">
                  <button
                    className="view-details-btn"
                    onClick={() => router.push(`/${item.campaignUrl}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="no-campaign">No campaigns available.</p>
      )}

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
                page === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={page !== totalPages ? handleNext : undefined}
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
