"use client";

import InlineSVG from "react-inlinesvg";
import "./PreviousGrid.css";
import { useEffect, useState, useRef } from "react";
import CardHolder from "./BattleCard/CarHolder";
import {
  BattleData,
  useFetchBattles,
  useSearchPreviousArts,
} from "@/hooks/battleHooks";
import PreviousArtPopup from "../PreviousArtPopup/PreviousArtPopup";
import Loader from "../../Loader/Loader";

interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
}

const MOBILE_LIMIT = 4;
const DESKTOP_LIMIT = 9;

export const PreviousGrid: React.FC<Props> = ({
  toggleUploadModal,
  campaignId,
  fontColor,
}) => {
  const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);
  const { battles, error, loading, fetchMoreBattles, totalPage } =
    useFetchBattles();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MOBILE_LIMIT);
  const [hasnext, setHasNext] = useState(false);
  const [pop, setPopUp] = useState(false);
  const [sort, setSort] = useState("date");
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState<BattleData | null>(null); // State for selected art
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("dateDsc");
  const {
    previousArts,
    totalSearchPage,
    loading: searchLoading,
    error: searchError,
    searchArts,
  } = useSearchPreviousArts();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const getLimitBasedOnScreenSize = () => {
    // Set the limit based on the window width
    return window.innerWidth < 768 ? MOBILE_LIMIT : DESKTOP_LIMIT;
  };
  const openPopup = (artData: BattleData) => {
    setSelectedArt(artData);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  useEffect(() => {
    if (battles && battles.pastBattles) {
      if (page > battles.totalPages - 1) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }

      console.log(battles.totalPages, page);
      setPreviousBattles(battles.pastBattles);
    }
  }, [battles]);

  useEffect(() => {
    const limit = getLimitBasedOnScreenSize();
    fetchMoreBattles(campaignId, sort, page, limit);
  }, [campaignId, page, limit]);

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortType = event.target.value;
    setSort(sortType);
    setSelectedSort(sortType);
    setPage(1); // Reset to first page when sorting
    const limit = getLimitBasedOnScreenSize();
    fetchMoreBattles(campaignId, sortType, 1, limit);
  };

  const scrollToPreviousSection = () => {
    const previousSection = document.getElementById("previous");
    if (previousSection) {
      const sectionPosition =
        previousSection.getBoundingClientRect().top + window.scrollY;
      const isMobile = window.innerWidth < 768;
      const rem = isMobile ? 1 : 2.5;
      const offset = rem * 16;
      window.scrollTo({
        top: !isMobile ? sectionPosition + offset : sectionPosition - 20,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const currentTotalPage = searchQuery ? totalSearchPage : totalPage;
    if (page < currentTotalPage) {
      setPage((prevPage) => prevPage + 1);
      const limit = getLimitBasedOnScreenSize();
      setLimit(limit);

      if (searchQuery) {
        searchArts(campaignId, searchQuery, page + 1, limit);
      } else {
        fetchMoreBattles(campaignId, sort, page + 1, limit);
      }

      scrollToPreviousSection();
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      const limit = getLimitBasedOnScreenSize();
      setLimit(limit);

      if (searchQuery) {
        searchArts(campaignId, searchQuery, page - 1, limit);
      } else {
        fetchMoreBattles(campaignId, sort, page - 1, limit);
      }

      scrollToPreviousSection();
    }
  };

  const handlePageClick = (pageNumber: number) => {
    if (pageNumber !== page) {
      setPage(pageNumber);
      const limit = getLimitBasedOnScreenSize();
      setLimit(limit);

      if (searchQuery) {
        searchArts(campaignId, searchQuery, pageNumber, limit);
      } else {
        fetchMoreBattles(campaignId, sort, pageNumber, limit);
      }

      scrollToPreviousSection();
    }
  };

  const renderPageNumbers = () => {
    const pagesToShow = 5;
    const currentTotalPage = searchQuery ? totalSearchPage : totalPage; // Use correct total pages
    let startPage = Math.max(1, page - 2); // Center the current page
    let endPage = Math.min(currentTotalPage, page + 2); // Show up to 5 pages

    if (endPage - startPage + 1 < pagesToShow) {
      // Adjust start and end if less than 5 pages are displayed
      if (startPage === 1) {
        endPage = Math.min(currentTotalPage, pagesToShow);
      } else if (endPage === currentTotalPage) {
        startPage = Math.max(1, currentTotalPage - pagesToShow + 1);
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (query) {
      const limit = getLimitBasedOnScreenSize();
      await searchArts(campaignId, query, 1, limit);
    }
  };
  useEffect(() => {
    console.log("Previous arts:", previousArts);
  }, [previousArts]);

  return (
    <>
      <div
        className="previous-hero w-full h-auto bg-black md:pt-4 pt-0 pb-6 mb-[60px]"
        id="previous"
      >
        {/* Filters top section */}
        <div className="filters w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:px-[7.8rem] px-3 pb-5 pt-10">
          <div className="filters-left flex items-center md:justify-center justify-between md:gap-2 gap-1 md:px-5 px-3 py-1 rounded-[7rem]">
            <div className="flex items-center gap-1">
              <div className="img md:h-11 md:w-11 h-9 w-9">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="w-full h-full"
                />
              </div>
              <div className="search-input md:w-[33rem] md:h-[3rem] p-2">
                <input
                  type="text"
                  placeholder="Search for arts, username"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full spartan-light text-white h-full px-2 text-md placeholder:text-sm border-0 outline-none bg-transparent search-input"
                />
              </div>
            </div>
            <div className="search-icon md:order-none">
              <InlineSVG src="/icons/search.svg" className="w-6 h-6" />
            </div>
          </div>

          <div
            className="filters-center relative md:w-auto w-[10rem] flex items-center justify-center md:gap-[4.5rem] gap-[2rem] md:px-8 px-3 md:py-1 py-2 rounded-[7rem] cursor-pointer bg-black"
            ref={dropdownRef}
            onClick={handleToggle}
          >
            <h2 className="spartan-light text-white md:text-md text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {selectedSort === "dateDsc" && "Latest First"}
              {selectedSort === "dateAsc" && "Oldest First"}
              {selectedSort === "voteDsc" && "Top Collected Battles"}
              {selectedSort === "voteAsc" && "Least Collected Battles"}
            </h2>
            <div className="down-icon md:h-[3rem] h-[2rem] flex justify-center items-center">
              <InlineSVG
                src="/icons/down-arrow.svg"
                className="w-3 h-3 spartan-light"
              />
            </div>
            {isOpen && (
              <div className="options absolute top-[100%] left-0 w-[150%] pt-4 rounded-3xl bg-black">
                <div
                  className="option px-5 py-3 top-voted bg-black"
                  onClick={() =>
                    handleSort({
                      target: { value: "voteDsc" },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <h2 className="spartan-light text-sm text-white">
                    Top Collected Battles
                  </h2>
                </div>
                <div
                  className="option px-5 py-3 least-voted bg-black"
                  onClick={() =>
                    handleSort({
                      target: { value: "voteAsc" },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <h2 className="spartan-light text-sm">
                    Least Collected Battles
                  </h2>
                </div>
                <div
                  className="option px-5 py-3 latest-first bg-black"
                  onClick={() =>
                    handleSort({
                      target: { value: "dateDsc" },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <h2 className="spartan-light text-sm">Latest First</h2>
                </div>
                <div
                  className="option px-5 pt-3 pb-7 oldest-first bg-black rounded-bl-3xl rounded-br-3xl"
                  onClick={() =>
                    handleSort({
                      target: { value: "dateAsc" },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <h2 className="spartan-light text-sm">Oldest First</h2>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative grid-view w-full flex justify-center md:px-[7rem] px-3 md:pt-5 md:pb-5 pb-5 bg-black">
          {loading || searchLoading ? (
            <div className="flex justify-center items-center w-full h-full py-10">
              <Loader md="22" sm="15" />
            </div>
          ) : searchQuery ? (
            previousArts && previousArts.length > 0 ? (
              <CardHolder
                battles={previousArts}
                campaignId={campaignId}
                setRefresh={setRefresh}
                currentPage={page}
                totalPage={totalSearchPage}
                onCardClick={openPopup}
              />
            ) : (
              <p className="flex items-center justify-center gap-2 py-[80px] text-white font-semibold text-lg">
                <InlineSVG
                  src="/icons/info.svg"
                  className="fill-current text-white font-bold point-c w-4 h-4 cursor-pointer"
                />{" "}
                No arts available!
              </p>
            )
          ) : (
            <CardHolder
              battles={previousBattles}
              campaignId={campaignId}
              setRefresh={setRefresh}
              currentPage={page}
              totalPage={totalPage}
              onCardClick={openPopup}
            />
          )}
        </div>

        {(previousBattles.length > 0 || previousArts.length > 0) && (
          <div className="pagination-section relative w-full flex justify-center py-5">
            <div className="pagination rounded-[7rem]">
              <div className="w-auto flex items-center justify-center md:gap-[2rem] gap-[1rem] px-7 py-3 rounded-[7rem] bg-black">
                <div
                  className="previous flex items-center gap-1"
                  onClick={page !== 1 ? handlePrevious : undefined}
                  style={{
                    opacity: page === 1 ? 0.5 : 1,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
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
                  className="next flex items-center gap-1"
                  onClick={
                    page !== totalPage && page !== totalSearchPage
                      ? handleNext
                      : undefined
                  }
                  style={{
                    opacity:
                      page === totalPage || page === totalSearchPage ? 0.5 : 1,
                    cursor:
                      page === totalPage || page === totalSearchPage
                        ? "not-allowed"
                        : "pointer",
                  }}
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
        )}

        {isPopupOpen && (
          <PreviousArtPopup artData={selectedArt} onClose={closePopup} />
        )}
      </div>
    </>
  );
};
