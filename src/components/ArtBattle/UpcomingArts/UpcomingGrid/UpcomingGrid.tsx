"use client";

import InlineSVG from "react-inlinesvg";
import './UpcomingGrid.css';
import { useEffect, useState, useRef } from "react";
import { ArtData, useFetchArts, useSearchArts } from "@/hooks/artHooks";
import CardHolder from "./ArtCard/CardHolder";
import Loader from "../../Loader/Loader";
import Toast from "@/components/Toast";

interface Props {
    toggleUploadModal: () => void;
    uploadSuccess: boolean;
    campaignId: string;
    fontColor: string;
    adminEmail: string;
    showUploadModal: boolean;
}

const MOBILE_LIMIT = 9;
const DESKTOP_LIMIT = 8;

export const UpcomingGrid: React.FC<Props> = ({ toggleUploadModal, uploadSuccess, campaignId, fontColor, adminEmail, showUploadModal }) => {
    const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
    const [refresh, setRefresh] = useState(false);
    const { arts, totalPage, error, fetchMoreArts } = useFetchArts();
    const { totalSearchPage, searchArts } = useSearchArts();
    const [page, setPage] = useState<number | null>(null);
    const [sort, setSort] = useState<string | null>("dateDsc");
    const [sortLabel, setSortLabel] = useState("Latest First");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [selectedArt, setSelectedArt] = useState();
    const [loading, setLoading] = useState(false);
    const [hideSuccess, setHideSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [empty, setEmpty] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!showUploadModal) {
            handleSort({ value: 'dateDsc', label: "Latest First" });
        }
    }, [showUploadModal])

    const getLimitBasedOnScreenSize = () => {
        // Set the limit based on the window width
        return window.innerWidth < 768 ? MOBILE_LIMIT : DESKTOP_LIMIT;
    };

    useEffect(() => {
        if (upcomingArts.length === 0) {
            const scrollTimeout = setTimeout(() => {
                const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const isAtBottom = window.scrollY >= totalScrollHeight;

                if (isAtBottom) {
                    window.scrollTo({
                        top: totalScrollHeight * 0.99,
                        behavior: "smooth",
                    });

                    setTimeout(() => {
                        window.scrollTo({
                            top: totalScrollHeight,
                            behavior: "smooth",
                        });
                    }, 100);
                } else {
                    window.scrollTo({
                        top: totalScrollHeight,
                        behavior: "smooth",
                    });
                }
            }, 3500);

            return () => clearTimeout(scrollTimeout);
        }
    }, [upcomingArts]);

    useEffect(() => {
        if (sort) {
            setSearchQuery("")
        }
    }, [sort])

    const handleSort = ({ value, label }: { value: string, label: string }) => {
        setUpcomingArts([]);
        // const sortType = event.target.value
        setSort(value);
        setSortLabel(label);
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        setUpcomingArts([]);
        setPage(0);
    };

    const getArts = async () => {
        const limit = getLimitBasedOnScreenSize();
        if (loading || page === null || page === 0 || sort === null || !campaignId) return;
        // if (page === 1) {
        //     await new Promise(resolve => setTimeout(resolve, 100));
        // }
        try {
            if (!searchQuery) {
                if (page > totalPage) return;
                setLoading(true);
                const arts = await fetchMoreArts(campaignId, sort, page, limit);
                if (arts && arts.length > 0) {
                    setEmpty("");
                    // setUpcomingArts((prevArts) => [...prevArts, ...arts]);
                    setUpcomingArts((prevArts) => {
                        const artMap = new Map(prevArts.map(art => [art._id, art]));
                        arts.forEach((newArt: ArtData) => {
                            artMap.set(newArt._id, newArt);
                        });

                        return Array.from(artMap.values());
                    });
                } else {
                    console.log(`1. No data returned for page ${page}`);
                    setEmpty("No arts found!");
                }
            } else {
                console.log("ToT search pages:", totalSearchPage)
                if (page > totalSearchPage) return;
                setLoading(true);
                const arts = await searchArts(campaignId, searchQuery, page, limit);
                if (arts && arts.length > 0) {
                    // setUpcomingArts((prevArts) => [...prevArts, ...arts]);
                    setEmpty("");
                    setUpcomingArts((prevArts) => {
                        const artMap = new Map(prevArts.map(art => [art._id, art]));
                        arts.forEach((newArt: ArtData) => {
                            artMap.set(newArt._id, newArt);
                        });

                        return Array.from(artMap.values());
                    });
                } else {
                    console.log(`2. No data returned for page ${page}`);
                    setEmpty("No arts found!");
                }
            }
        } catch (error) {
            console.error("Error fetching arts:", error);
        } finally {
            setLoading(false);
        }
    }

    const removeArtById = (id: string) => {
        setUpcomingArts((prevArts) => prevArts.filter((art) => art._id !== id));
        setHideSuccess(true);
    };

    // Add debounce function for scroll handling
    const debounce = (func: () => void, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(func, delay);
        };
    };

    const handleInfiniteScroll = debounce(() => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !loading) {
            setPage((prevPage) => (prevPage === null ? 0 : prevPage + 1));
        }
    }, 100);

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
        return () => window.removeEventListener("scroll", handleInfiniteScroll);
    }, [loading]);

    useEffect(() => {
        getArts();
    }, [page, sort, refresh, uploadSuccess]);

    return (
        <>
            <div className="upcoming-hero w-full h-auto bg-black md:pt-4 pt-0 pb-20" id="upcoming">

                {/* Filters top section */}
                <div className="filters w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:px-[7.8rem] px-3 pb-5 pt-10">
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
                                    <h2 className="spartan-light text-sm text-white">Top Voted Arts</h2>
                                </div>
                                <div className="option px-5 py-3 least-voted bg-black" onClick={() => handleSort({ value: 'voteAsc', label: "Least Voted" })}>
                                    <h2 className="spartan-light text-sm">Least Voted Arts</h2>
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

                {/* {upcomingArts.length === 0 && loading && <Loader />} */}

                {/* Upcoming arts grid view section */}
                <div className={`grid-view w-full flex justify-center md:px-[7rem] px-3 md:pt-5 ${loading ? "pb-1" : "pb-5"} bg-black`}>
                    <CardHolder artData={upcomingArts} campaignId={campaignId} adminEmail={adminEmail} setRefresh={setRefresh} setSelectedArt={setSelectedArt} totalPage={totalPage} removeArtById={removeArtById} />
                </div>

                {empty && <div className="empty w-full flex items-center justify-center gap-2 pb-20">
                    <InlineSVG
                        src='/icons/info.svg'
                        className='fill-current text-white font-bold point-c w-4 h-4 cursor-pointer'
                    />
                    <h2 className="text-white font-semibold text-lg">{empty}</h2>
                </div>
                }

                {loading && <div className="upcoming-loader md:h-[10rem] h-[5rem] md:mb-0 mb-8 w-full justify-center">
                    <Loader md="10" sm="8" />
                </div>}

                {hideSuccess && <Toast
                    success={true}
                    message={"Art hidden successfully!!"}
                    onClose={() => setHideSuccess(false)}
                />}

                {/* Pagination for upcoming arts */}
                {/* <div className="pagination-section relative w-full flex justify-center py-5">
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
                    {page === totalPage && upcomingArts.length < 5 && selectedArt && <div className="pagination-blur absolute w-full h-full z-0">

                    </div>}
                </div> */}
            </div>
        </>
    )
}
// Upcominggrid.tsx