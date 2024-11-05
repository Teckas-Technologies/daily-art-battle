"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignDetails.css";
import { useEffect, useState } from "react";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
import useCampaigns from "@/hooks/CampaignHook";
import { useSession, signIn } from "next-auth/react";

interface CampaignDetailsProps {
  toggleDistributeModal: () => void;
  campaignId: string;
}

interface ArtData {
  tokenId: number;
  artistId: string;
  arttitle: string;
  colouredArt: string;
  grayScale: string;
  upVotes: number;
  email: string;
}

interface CampaignAnalytics {
  totalVote: number;
  totalUpVotes: number;
  totalUniqueWallets: number;
  uniqueWallets: number[];
  mostVotedArt: ArtData[];
  mostUpVotedArt: ArtData[];
}
interface ArtsResponse {
  arts: ArtData[];
  totalDocuments: number;
  totalPages: number;
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

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  toggleDistributeModal,
  campaignId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [campaignAnalytics, setCampaignAnalytics] =
    useState<CampaignAnalytics | null>(null);
  const [artData, setArtData] = useState<ArtsResponse | null>(null);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("azure-ad-b2c", { callbackUrl: "/" });
    }
    console.log("status", status);
    console.log("session", session);
  }, [status, session]);
  const idToken = session?.idToken || "";
  const { fetchCampaignAnalytics, fetchCampaignFromArtAPI, totalPages, art } =
    useCampaigns(idToken);
  useEffect(() => {
    console.log("Fetching data for page:", page);
    fetchCampaignFromArtAPI(campaignId, page, limit);
  }, [campaignId, page, limit]);

  const handlePageClick = (newPage: number) => {
    console.log("Page clicked:", newPage);
    setPage(newPage);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analyticsData = await fetchCampaignAnalytics(campaignId);
        console.log("log from details", analyticsData);

        if (analyticsData) {
          setCampaignAnalytics(analyticsData);
        } else {
          console.warn("No analytics data returned");
        }
      } catch (error) {
        console.error("Error fetching campaign analytics:", error);
      }
    };

    fetchAnalytics();
  }, [fetchCampaignAnalytics, campaignId]);
  console.log(">>>>>", campaignId);

  const mostUpVotedArt = campaignAnalytics?.mostUpVotedArt[0];
  const participantsList = campaignAnalytics?.uniqueWallets || [];
  return (
    <div className="campaign-details-container">
      <h1>Campaign Ended</h1>

      <div className="art-section">
        <div className="flex items-center justify-center gap-[25px] md:gap-[30px]">
          <div className="art-container">
            <h3 className="art-heading">Most Collected Art</h3>
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
                  <h4 style={{ margin: 0 }}>
                    {mostUpVotedArt && mostUpVotedArt.artistId
                      ? mostUpVotedArt.artistId.length > 10
                        ? `${mostUpVotedArt.artistId.slice(0, 10)}...`
                        : mostUpVotedArt.artistId
                      : "Unknown Artist"}
                  </h4>
                </div>

                <img
                  src={mostUpVotedArt?.colouredArt}
                  alt={mostUpVotedArt?.arttitle}
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
                  {mostUpVotedArt?.upVotes} Upvotes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="art-details">
          <div>
            <h3>Total Votes</h3>
            <p>{campaignAnalytics?.totalVote}</p>
          </div>
          <div>
            <h3>Total Participants</h3>
            <p>{participantsStats.totalVotes}</p>
          </div>
          <div>
            <h3>Unique Participants</h3>
            <p> {campaignAnalytics?.totalUniqueWallets}</p>
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
            {participantsList?.length > 0 ? (
              participantsList?.map((participant, index) => (
                <div
                  key={index}
                  className="participant"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span className="participant-number">{index + 1}</span>
                  <span className="participant-name">{participant}</span>
                </div>
              ))
            ) : (
              <p>No participants available.</p>
            )}
          </div>

          <div className="summary-arts">
            <h3>Arts</h3>
            <div className="arts-grid">
              {art.length > 0 ? (
                art.map((artItem, index) => (
                  <div key={index} className="art-card">
                    <img src={artItem.colouredArt} alt={`Art ${index + 1}`} />
                  </div>
                ))
              ) : (
                <div>No art data available</div>
              )}
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
                    onClick={handlePrevious}
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
                    onClick={handleNext}
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
        </div>
      </div>
    </div>
  );
};
export default CampaignDetails;
