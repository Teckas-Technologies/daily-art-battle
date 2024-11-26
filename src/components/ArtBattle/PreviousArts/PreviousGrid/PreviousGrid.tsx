"use client";

import InlineSVG from "react-inlinesvg";
import "./PreviousGrid.css";
import { useEffect, useState, useRef } from "react";
import CardHolder from "./BattleCard/CarHolder";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
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
    setPage(1); // Reset to first page when sorting
    const limit = getLimitBasedOnScreenSize();
    fetchMoreBattles(campaignId, sortType, 1, limit);
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
                  className="w-full spartan-light text-white h-full px-2 text-md placeholder:text-sm border-0 outline-none bg-transparent search-input"
                />
              </div>
            </div>
            <div className="search-icon md:order-none">
              <InlineSVG src="/icons/search.svg" className="w-6 h-6" />
            </div>
          </div>

          <div
            className="filters-center relative md:w-auto w-[8rem] flex items-center justify-center md:gap-[4.5rem] gap-[2rem] md:px-8 px-3 md:py-1 py-2  rounded-[7rem] cursor-pointer bg-black"
            ref={dropdownRef}
            onClick={handleToggle}
          >
            <h2 className="spartan-light text-white md:text-md text-sm">
              Sort by
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
                    Top Voted Battles
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
                  <h2 className="spartan-light text-sm">Least Voted Battles</h2>
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

        {/* Previous battles grid view section */}
        {loading ? (
          <Loader sm="15" md="22" />
        ) : (
          <div className="relative grid-view w-full flex justify-center md:px-[7rem] px-3 md:pt-5 md:pb-5 pb-5 bg-black">
            <CardHolder
              battles={previousBattles}
              campaignId={campaignId}
              setRefresh={setRefresh}
              currentPage={page}
              totalPage={totalPage}
              onCardClick={openPopup}
            />
          </div>
        )}

        {/* Pagination for previous arts */}
        {previousBattles.length > 0 && (
          <div className="pagination-section relative w-full flex justify-center py-5">
            <div className="pagination rounded-[7rem]">
              <div className="w-auto flex items-center justify-center md:gap-[2rem] gap-[1rem] px-7 py-3 rounded-[7rem] bg-black">
                <div
                  className={`previous flex items-center gap-1 ${
                    page === 1
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
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
        )}

        {isPopupOpen && (
          <PreviousArtPopup artData={selectedArt} onClose={closePopup} />
        )}
      </div>
    </>
  );
};
