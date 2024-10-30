"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignDetails.css";
import { useState } from "react";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
interface CampaignDetailsProps {
  toggleDistributeModal: () => void;
}
const participantsStats = {
  totalParticipants: 24,
  totalVotes: 24,
  totalUpvotes: 24,
  uniqueParticipants: 24,
};

const artworks = [
  { name: "Raghuvaran", image: "/images/art1.jpg", upvotes: 9 },
  { name: "Karthik", image: "/images/art2.jpg", upvotes: 9 },
  { name: "Siri", image: "/images/art3.jpg", upvotes: 9 },
  { name: "Siri", image: "/images/art3.jpg", upvotes: 9 },
  { name: "Siri", image: "/images/art3.jpg", upvotes: 9 },
  { name: "Siri", image: "/images/art3.jpg", upvotes: 9 },
];
const daywinners = [
  { name: "Raghuvaran", image: "/images/uploadart2.png", upvotes: 9, day: 1 },
  { name: "Karthik", image: "/images/uploadart2.png", upvotes: 9, day: 2 },
  { name: "Siri", image: "/images/uploadart2.png", upvotes: 9, day: 3 },
  { name: "Hanuma", image: "/images/uploadart2.png", upvotes: 9, day: 4 },
  { name: "Prashant", image: "/images/uploadart2.png", upvotes: 9, day: 5 },
  { name: "Satish", image: "/images/uploadart2.png", upvotes: 9, day: 6 },
];

const participants = Array(30).fill("Raghuvaran Karthik");
const arts = [
  "/images/uploadart2.png",
  "/images/uploadart2.png",
  "/images/uploadart2.png",
  "/images/uploadart2.png",
  "/images/uploadart2.png",
  "/images/uploadart2.png",
];
const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  toggleDistributeModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

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
  return (
    <div className="campaign-details-container">
      <h1>Campaign Ended</h1>

      <div className="art-section">
        <div className="flex items-center justify-center gap-[25px] md:gap-[30px]">
          <div className="art-container">
            <h3 className="art-heading">Most Voted Art</h3>
            <div className="common">
              <div className="art">
                <div
                  className="flex items-center"
                  style={{ marginBottom: "10px" }}
                >
                  <img
                    src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                    alt="Profile"
                    className="profile-image"
                  />
                  <h4 style={{ margin: 0 }}>Raghuvaran</h4>
                </div>

                <img
                  src="/images/uploadart1.png"
                  alt=""
                  className="art-image"
                />
                <p
                  className="flex items-center justify-end"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <InlineSVG
                    className="heart-icon"
                    src="/icons/heart.svg"
                    style={{ marginRight: "2px" }}
                  />
                  9 Upvotes
                </p>
              </div>
            </div>
          </div>

          <div className="art-container">
            <h3 className="art-heading">Most Upvoted Art</h3>
            <div className="common">
              <div className="art">
                <div
                  className="flex items-center"
                  style={{ marginBottom: "10px" }}
                >
                  <img
                    src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                    alt="Profile"
                    className="profile-image"
                  />
                  <h4 style={{ margin: 0 }}>Raghuvaran</h4>
                </div>

                <img
                  src="/images/uploadart1.png"
                  alt="Raghuvaran"
                  className="art-image"
                />
                <p
                  className="flex items-center justify-end"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <InlineSVG
                    src="/icons/heart.svg"
                    className="heart-icon"
                    style={{ marginRight: "2px" }}
                  />
                  9 Upvotes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="art-details">
          <div>
            <h3>Total Participants</h3>
            <p>{participantsStats.totalParticipants}</p>
          </div>
          <div>
            <h3>Total Votes</h3>
            <p>{participantsStats.totalVotes}</p>
          </div>
          <div>
            <h3>Total Upvotes</h3>
            <p>{participantsStats.totalUpvotes}</p>
          </div>
          <div>
            <h3>Unique Participants</h3>
            <p>{participantsStats.uniqueParticipants}</p>
          </div>
        </div>
      </div>

      <div className="special-winner">
        <h2>Special Rewards Winners</h2>
        <div className="winnersGrid">
          {artworks.map((art, index) => (
           <div className="common">
             <div className="winner" key={index}>
              <div
                className="flex items-center"
                style={{ marginBottom: "10px" }}
              >
                <img
                  src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                  alt="Profile"
                  className="profile-image"
                />
                <h4 style={{ margin: 0 }}>Raghuvaran</h4>{" "}
              </div>
              <img
                src="/images/uploadart1.png"
                alt={art.name}
                className="image"
              />

              <p
                className="flex items-center justify-end"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <InlineSVG
                  src="/icons/heart.svg"
                  style={{ marginRight: "2px" }}
                  className="heart-icon"
                />
                9 upvotes
              </p>
            </div>
           </div>
          ))}
        </div>
      </div>
      <div className="daywise-winners">
        <h2>Day Wise Winners</h2>
        <div className="daywise-winners-grid">
          {daywinners.map((art, index) => (
           <div className="common">
             <div className="daywise-winner" key={index}>
              <h3>Winner: Day {art.day}</h3>
              <div className="profile-section">
                <img
                  src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                  alt="Profile"
                  className="profile-image"
                />
                <h4>Raghuvaran</h4>
              </div>
              <img
                src="/images/uploadart1.png"
                alt={art.name}
                className="art-img"
              />
              <p
                className="flex items-center justify-end"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <InlineSVG
                  src="/icons/heart.svg"
                  style={{ marginRight: "2px" }}
                  className="heart-icon"
                />
                9 Upvotes
              </p>
            </div>
           </div>
          ))}
        </div>
      </div>
      <div className="summary-container">
        <h2 className="summary-heading">Summary</h2>
        <p className="summary-text">
          Distribute special rewards before 7 days of campaign ending date
        </p>
        <div className="distribute-btn-Wrapper">
          <button className="distribute-btn " onClick={toggleDistributeModal}>
            Distribute Rewards
          </button>

          <div className="distribute-btn-Border" />

          <div className="distribute-btn-Overlay" />
        </div>
        <div className="summary">
          <div className="participants">
            <h2>Participants</h2>
            {participants.map((participant, index) => (
              <div
                key={index}
                className="participant"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span className="participant-number">{index + 1}</span>
                <span className="participant-name">{participant}</span>
              </div>
            ))}
          </div>

          <div className="summary-arts">
            <h2>Arts</h2>
            <div className="arts-grid">
              {arts.map((art, index) => (
                <div key={index} className="art-card">
                  <img src={art} alt={`Art ${index + 1}`} />
                </div>
              ))}
            </div>
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
                    <h4 className="hidden md:block">Previous</h4>
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
                        <h4>{pageNumber}</h4>
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
                    <h4 className="hidden md:block">Next</h4>
                    <InlineSVG
                      src="/icons/right-arrow.svg"
                      className="w-3 h-3 spartan-light"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CampaignDetails;
