"use client";

import { useEffect, useRef, useState } from "react";
import "./UploadedArtsGrid.css"
import { UploadsHolder } from "../Uploads/UploadsHolder";
import { useFetchUserArts, useSearchUserArts } from "@/hooks/userArtsHook";
import InlineSVG from "react-inlinesvg";
import { ArtData } from "@/hooks/artHooks";
import Loader from "@/components/ArtBattle/Loader/Loader";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    rendered: boolean;
}

export const UploadedArtsGrid: React.FC<Props> = ({ rendered }) => {
    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<string>("dateDsc");
    const { arts, loading, totalPage, fetchUserArts } = useFetchUserArts();
    const { searchLoading, searchedArts, totalSearchPage, searchUserArts } = useSearchUserArts();
    const [userArts, setUserArts] = useState<ArtData[] | null>(null);
    const [sortLabel, setSortLabel] = useState("Latest First");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [empty, setEmpty] = useState("");
    const [total, setTotal] = useState(totalPage);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    let userDetails = user;

    useEffect(() => {
        if (loading || searchLoading) {
            setIsLoading(true);
        }
        if (!loading && !searchLoading) {
            setIsLoading(false)
        }
    }, [loading, searchLoading])

    useEffect(() => {
        const initializeData = async () => {
            const limit = 8;
            if (!searchQuery) {
                fetchUserArts(sort, page, limit);
            } else {
                searchUserArts(searchQuery, page, limit);
            }
        };
        if (userDetails) {
            const timeoutId = setTimeout(initializeData, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [sort, page, searchQuery, userDetails]);

    const [hasnext, setHasNext] = useState(false);

    useEffect(() => {
        if (arts) {
            if (page <= total - 1) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
        }
        if (!searchQuery && arts) {
            setUserArts(arts);
            setTotal(totalPage);
            setEmpty("");
        }
        if (searchQuery && searchedArts) {
            setUserArts(searchedArts);
            setTotal(totalSearchPage);
            setEmpty("");
        }
        if (!isLoading && userArts?.length === 0) {
            setEmpty("No arts found!");
        }
    }, [arts, searchedArts, userDetails, searchQuery, isLoading]);

    useEffect(() => {
        if (sort) {
            setSearchQuery("")
        }
    }, [sort])

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSort = ({ value, label }: { value: string, label: string }) => {
        setSort(value);
        setSortLabel(label);
        setPage(1);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
    };

    const handleNext = () => {
        if (page < total) {
            setPage((prevPage) => prevPage + 1);
            const limit = 8;
            fetchUserArts(sort, page + 1, limit);

            const upcomingSection = document.getElementById('uploads');
            if (upcomingSection) {
                const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
                const isMobile = window.innerWidth < 768 ? true : false;
                const rem = isMobile ? -8 : -8;
                const offset = rem * 16;
                window.scrollTo({
                    top: sectionPosition + offset,
                    behavior: 'smooth',
                });
            }
        }
    };

    const handlePrevious = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
            const limit = 8;
            fetchUserArts(sort, page - 1, limit);

            const upcomingSection = document.getElementById('uploads');
            if (upcomingSection) {
                const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
                const isMobile = window.innerWidth < 768 ? true : false;
                const rem = isMobile ? -8 : -8;
                const offset = rem * 16;
                window.scrollTo({
                    top: sectionPosition + offset,
                    behavior: 'smooth',
                });
            }
        }
    };

    const handlePageClick = (pageNumber: number) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
            const limit = 8;
            fetchUserArts(sort, pageNumber, limit);

            const upcomingSection = document.getElementById('uploads');
            if (upcomingSection) {
                const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
                const isMobile = window.innerWidth < 768 ? true : false;
                const rem = isMobile ? -8 : -8;
                const offset = rem * 16;
                console.log(sectionPosition + offset, "Test")
                window.scrollTo({
                    top: sectionPosition + offset,
                    behavior: 'smooth',
                });
            }
        }
    };

    const renderPageNumbers = () => {
        const pagesToShow = 5;
        let startPage = Math.max(1, page - 2);  // Center the current page
        let endPage = Math.min(total, page + 2);  // Show up to 5 pages

        if (endPage - startPage + 1 < pagesToShow) {
            // Adjust start and end if less than 5 pages are displayed
            if (startPage === 1) {
                endPage = Math.min(total, pagesToShow);
            } else if (endPage === total) {
                startPage = Math.max(1, total - pagesToShow + 1);
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    return (
        <div className="uploads-grid w-full h-full">

            {/* Filters top section */}
            <div className="filters w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-5 pt-10 mt-10">
                <div className="filters-left flex items-center md:justify-center justify-between md:gap-2 gap-1 md:px-5 px-3 py-1 rounded-[7rem]">
                    <div className="flex items-center gap-1">
                        <div className="img md:h-11 md:w-11 h-9 w-9">
                            <img src="/images/logo.png" alt="logo" className="w-full h-full" />
                        </div>
                        <div className="search-input md:w-[13rem] lg:w-[23rem] xl:w-[33rem] md:h-[3rem] p-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for arts, username"
                                className="w-full spartan-light text-white h-full px-2 text-md placeholder:text-sm border-0 outline-none bg-transparent search-input"
                            />
                        </div>
                    </div>
                    <div className="search-icon md:order-none">
                        <InlineSVG
                            src="/icons/search.svg"
                            className="w-6 h-6"
                        />
                    </div>
                </div>

                <div className="filters-center relative md:w-auto w-[10rem] flex items-center justify-center md:gap-[4.5rem] gap-[2rem] md:px-8 px-3 md:py-1 py-2  rounded-[7rem] cursor-pointer bg-black" ref={dropdownRef} onClick={handleToggle}>
                    <h2 className="spartan-light text-white md:text-md text-sm">{sortLabel}</h2>
                    <div className="down-icon md:h-[3rem] h-[2rem] flex justify-center items-center">
                        <InlineSVG
                            src="/icons/down-arrow.svg"
                            className="w-3 h-3 spartan-light"
                        />
                    </div>
                    {isOpen && (
                        <div className="options absolute top-[100%] left-0 w-[150%] pt-4 rounded-3xl bg-black">
                            <div className="option px-5 py-3 top-voted bg-black" onClick={() => handleSort({ value: 'voteDsc', label: "Top Voted" })}>
                                <h2 className="spartan-light text-sm text-white">Top Collected Arts</h2>
                            </div>
                            <div className="option px-5 py-3 least-voted bg-black" onClick={() => handleSort({ value: 'voteAsc', label: "Least Voted" })}>
                                <h2 className="spartan-light text-sm">Least Collected Arts</h2>
                            </div>
                            <div className="option px-5 py-3 latest-first bg-black" onClick={() => handleSort({ value: 'dateDsc', label: "Latest First" })}>
                                <h2 className="spartan-light text-sm">Latest First</h2>
                            </div>
                            <div className="option px-5 pt-3 pb-7 oldest-first bg-black rounded-bl-3xl rounded-br-3xl" onClick={() => handleSort({ value: 'dateAsc', label: "Oldest First" })}>
                                <h2 className="spartan-light text-sm">Oldest First</h2>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="upload-grid grid-view w-full flex flex-col justify-center items-center min-h-[25rem]" id="uploads">
                <UploadsHolder artData={userArts} isNFT={false} isUploaded={true} />

                {empty && !isLoading && <div className="empty w-full flex items-center justify-center gap-2 pb-20">
                    <InlineSVG
                        src='/icons/info.svg'
                        className='fill-current text-white font-bold point-c w-4 h-4 cursor-pointer'
                    />
                    <h2 className="text-white font-semibold text-lg">{empty}</h2>
                </div>
                }

                {isLoading && userArts && userArts?.length < 1 && !empty && <div className="uploads-loader w-full flex items-center justify-center">
                    <Loader md="22" sm="15" />
                </div>
                }
            </div>



            {/* Pagination for upcoming arts */}
            {userArts && userArts?.length > 0 && <div className="pagination-section relative w-full flex justify-center py-5 mt-5 mb-20">
                <div className="pagination rounded-[7rem]">
                    <div className="w-auto flex items-center justify-center md:gap-[2rem] gap-[1rem] px-7 py-3 rounded-[7rem] bg-black">
                        <div className={`previous flex items-center gap-1 ${page === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} onClick={page !== 1 ? handlePrevious : undefined}>
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
                                    className={`page md:h-[3rem] md:w-[3rem] h-[2rem] w-[2rem] flex justify-center items-center ${page === pageNumber ? 'active' : 'cursor-pointer'}`}
                                    onClick={() => handlePageClick(pageNumber)}
                                >
                                    <h2>{pageNumber}</h2>
                                </div>
                            ))}
                        </div>
                        <div className={`next flex items-center gap-1 ${page === totalPage ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} onClick={page !== totalPage ? handleNext : undefined}>
                            <h2 className="hidden md:block">Next</h2>
                            <InlineSVG
                                src="/icons/right-arrow.svg"
                                className="w-3 h-3 spartan-light"
                            />
                        </div>

                    </div>
                </div>
            </div>}
        </div>
    )
}