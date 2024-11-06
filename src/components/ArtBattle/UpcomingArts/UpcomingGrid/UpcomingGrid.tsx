"use client";

import InlineSVG from "react-inlinesvg";
import './UpcomingGrid.css';
import { useEffect, useState, useRef } from "react";
import { ArtData, useFetchArts, useSearchArts } from "@/hooks/artHooks";
import CardHolder from "./ArtCard/CardHolder";
import Loader from "../../Loader/Loader";

interface Props {
    toggleUploadModal: () => void;
    uploadSuccess: boolean;
    campaignId: string;
    fontColor: string;
    adminEmail: string;
    userMail: string;
}

const MOBILE_LIMIT = 9;
const DESKTOP_LIMIT = 8;

export const UpcomingGrid: React.FC<Props> = ({ toggleUploadModal, uploadSuccess, campaignId, fontColor, adminEmail, userMail }) => {
    const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
    const [refresh, setRefresh] = useState(false);
    const { arts, totalPage, error, fetchMoreArts } = useFetchArts();
    const { searchArts } = useSearchArts();
    const [page, setPage] = useState<number | null>(null);
    const [sort, setSort] = useState<string | null>("dateDsc");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [selectedArt, setSelectedArt] = useState();
    const [loading, setLoading] = useState(false);
    const [hideSuccess, setHideSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

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

    const getLimitBasedOnScreenSize = () => {
        // Set the limit based on the window width
        return window.innerWidth < 768 ? MOBILE_LIMIT : DESKTOP_LIMIT;
    };

    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUpcomingArts([]);
        const sortType = event.target.value
        setSort(sortType);
        setPage(0);
    };

    const getArts = async () => {
        const limit = getLimitBasedOnScreenSize();
        if (loading || page === null || page === 0 || sort === null || !campaignId) return;
        // if (page === 1) {
        //     await new Promise(resolve => setTimeout(resolve, 100));
        // }
        setLoading(true);
        try {
            const arts = await fetchMoreArts(campaignId, sort, page, limit);
            if (arts && arts.length > 0) {
                // setUpcomingArts((prevArts) => [...prevArts, ...arts]);
                setUpcomingArts((prevArts) => {
                    const artMap = new Map(prevArts.map(art => [art._id, art]));
                    arts.forEach((newArt: ArtData) => {
                        artMap.set(newArt._id, newArt);
                    });

                    return Array.from(artMap.values());
                });
            } else {
                console.log(`No data returned for page ${page}`);
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

    const handleSuccessClose = () => {
        setHideSuccess(false);
    }


    // const handleNext = () => {
    //     if (page < totalPage) {
    //         setPage((prevPage) => prevPage + 1);
    //         const limit = getLimitBasedOnScreenSize();
    //         fetchMoreArts(campaignId, sort, page + 1, limit);

    //         const upcomingSection = document.getElementById('upcoming');
    //         if (upcomingSection) {
    //             const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
    //             const isMobile = window.innerWidth < 768 ? true : false;
    //             const rem = isMobile ? 1 : 3;
    //             const offset = rem * 16;
    //             window.scrollTo({
    //                 top: !isMobile ? sectionPosition + offset : sectionPosition - 70,
    //                 behavior: 'smooth',
    //             });
    //         }
    //     }
    // };

    // const handlePrevious = () => {
    //     if (page > 1) {
    //         setPage((prevPage) => prevPage - 1);
    //         const limit = getLimitBasedOnScreenSize();
    //         fetchMoreArts(campaignId, sort, page - 1, limit);

    //         const upcomingSection = document.getElementById('upcoming');
    //         if (upcomingSection) {
    //             const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
    //             const isMobile = window.innerWidth < 768 ? true : false;
    //             const rem = isMobile ? 1 : 3;
    //             const offset = rem * 16;
    //             window.scrollTo({
    //                 top: !isMobile ? sectionPosition + offset : sectionPosition - 70,
    //                 behavior: 'smooth',
    //             });
    //             // upcomingSection.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }
    // };

    // const handlePageClick = (pageNumber: number) => {
    //     if (pageNumber !== page) {
    //         setPage(pageNumber);
    //         const limit = getLimitBasedOnScreenSize();
    //         fetchMoreArts(campaignId, sort, pageNumber, limit);

    //         const upcomingSection = document.getElementById('upcoming');
    //         if (upcomingSection) {
    //             const sectionPosition = upcomingSection.getBoundingClientRect().top + window.scrollY;
    //             const isMobile = window.innerWidth < 768 ? true : false;
    //             const rem = isMobile ? 1 : 3;
    //             const offset = rem * 16;
    //             window.scrollTo({
    //                 top: !isMobile ? sectionPosition + offset : sectionPosition - 70,
    //                 behavior: 'smooth',
    //             });
    //         }
    //     }
    // };

    // const renderPageNumbers = () => {
    //     const pagesToShow = 5;
    //     let startPage = Math.max(1, page - 2);  // Center the current page
    //     let endPage = Math.min(totalPage, page + 2);  // Show up to 5 pages

    //     if (endPage - startPage + 1 < pagesToShow) {
    //         // Adjust start and end if less than 5 pages are displayed
    //         if (startPage === 1) {
    //             endPage = Math.min(totalPage, pagesToShow);
    //         } else if (endPage === totalPage) {
    //             startPage = Math.max(1, totalPage - pagesToShow + 1);
    //         }
    //     }

    //     return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    // };

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

                    <div className="filters-center relative md:w-auto w-[8rem] flex items-center justify-center md:gap-[4.5rem] gap-[2rem] md:px-8 px-3 md:py-1 py-2  rounded-[7rem] cursor-pointer bg-black" ref={dropdownRef} onClick={handleToggle}>
                        <h2 className="spartan-light text-white md:text-md text-sm">Sort by</h2>
                        <div className="down-icon md:h-[3rem] h-[2rem] flex justify-center items-center">
                            <InlineSVG
                                src="/icons/down-arrow.svg"
                                className="w-3 h-3 spartan-light"
                            />
                        </div>
                        {isOpen && (
                            <div className="options absolute top-[100%] left-0 w-[150%] pt-4 rounded-3xl bg-black">
                                <div className="option px-5 py-3 top-voted bg-black" onClick={() => handleSort({ target: { value: 'voteDsc' } } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <h2 className="spartan-light text-sm text-white">Top Voted Arts</h2>
                                </div>
                                <div className="option px-5 py-3 least-voted bg-black" onClick={() => handleSort({ target: { value: 'voteAsc' } } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <h2 className="spartan-light text-sm">Least Voted Arts</h2>
                                </div>
                                <div className="option px-5 py-3 latest-first bg-black" onClick={() => handleSort({ target: { value: 'dateDsc' } } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <h2 className="spartan-light text-sm">Latest First</h2>
                                </div>
                                <div className="option px-5 pt-3 pb-7 oldest-first bg-black rounded-bl-3xl rounded-br-3xl" onClick={() => handleSort({ target: { value: 'dateAsc' } } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <h2 className="spartan-light text-sm">Oldest First</h2>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {upcomingArts.length === 0 && <Loader />}

                {/* Upcoming arts grid view section */}
                <div className="grid-view w-full flex justify-center md:px-[7rem] px-3 md:pt-5 md:pb-5 pb-5 bg-black">
                    <CardHolder artData={upcomingArts} campaignId={campaignId} adminEmail={adminEmail} userMail={userMail} setRefresh={setRefresh} setSelectedArt={setSelectedArt} totalPage={totalPage} removeArtById={removeArtById} />
                </div>

                {hideSuccess && <div className="upcoming-popup-holder fixed top-0 z-50 w-full h-full flex items-center justify-center px-3">
                    <div className="upcoming-popup lg:w-[38.5rem] md:w-[34.5rem] w-full h-auto lg:p-10 md:p-8  p-4 rounded-2xl bg-black">
                        <div className="close-art w-full flex justify-between">
                            <div className="dummy md:w-[1.9rem] md:h-[1.9rem] w-[1.5rem] h-[1.5rem]">

                            </div>
                            <h2 className='text-green text-md'>Hide Art</h2>
                            <div className="close-icon md:w-[1.9rem] md:h-[1.9rem] w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-md cursor-pointer" onClick={handleSuccessClose}>
                                <InlineSVG
                                    src="/icons/close.svg"
                                    className="md:w-4 md:h-4 w-3 h-3 spartan-light"
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="success-holder w-[15rem] h-[10rem]">
                                <img src="/images/success.png" alt="success" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <h3 className='spartan-semibold text-2xl text-white text-center pb-5 pt-6'>Art hidden successfully!</h3>
                    </div>
                </div>}

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