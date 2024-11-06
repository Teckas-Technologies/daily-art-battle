"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignDetails.css";
import { useEffect, useState } from "react";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
import useCampaigns, { CampaignPageData } from "@/hooks/CampaignHook";
import { useSession, signIn } from "next-auth/react";
import DistributeRewardPopup from "../DistributeReward Popup/DistributePopup";
import FewParticipantsPopup from "../DistributeReward Popup/FewParticipants";
import AllParticipantpopup from "../DistributeReward Popup/AllParticipants";
import { useMbWallet } from "@mintbase-js/react";

interface CampaignDetailsProps {
  toggleDistributeModal: () => void;
  campaignId: string;
  campaign?: CampaignPageData | null;
}

interface ArtData {
  tokenId: number;
  artistId: string;
  arttitle: string;
  colouredArt: string;
  grayScale: string;
  raffleTickets: number;
  email: string;
}

interface CampaignAnalytics {
  totalRaffle: number;
  totalParticipants: number;
  totalUpVotes: number;
  totalUniqueWallets: number;
  uniqueWallets: number[];
  mostVotedArt: ArtData[];
  mostUpVotedArt: ArtData[];
  specialWinnerArts: ArtData[];
}
interface ArtsResponse {
  arts: ArtData[];
  totalDocuments: number;
  totalPages: number;
}
interface DayWinner {
  _id: string;
  artAId: string;
  artBId: string;
  artAartistId: string;
  artBartistId: string;
  artAtitle: string;
  artBtitle: string;
  artAgrayScale: string;
  artBgrayScale: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  artAgrayScaleReference: string;
  artBgrayScaleReference: string;
  startTime: string;
  endTime: string;
  isBattleEnded: boolean;
  isNftMinted: boolean;
  artAVotes: number;
  artBVotes: number;
  artAvoters: string[];
  artBvoters: string[];
  winningArt: "Art A" | "Art B";
  artAspecialWinner?: string | null;
  artBspecialWinner?: string | null;
  campaignId: string;
  totalVotes: number;
}
interface Wallet {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

const dayWinners: DayWinner[] = [];

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  toggleDistributeModal,
  campaignId,
  campaign,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [campaignAnalytics, setCampaignAnalytics] =
    useState<CampaignAnalytics | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [dayWinners, setDayWinners] = useState([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardDistributed, setRewardDistributed] = useState(false);
  const [selectedArt, setSelectedArt] = useState<number[]>([]);
  const [showAllParticipantsPopup, setShowAllParticipantsPopup] =
    useState(false);
  const [showFewParticipantsPopup, setShowFewParticipantsPopup] =
    useState(false);
  const [specialWinnerCount, setSpecialWinnerCount] = useState<number | null>(
    null
  );

  const { data: session, status } = useSession();
  const { activeAccountId, isConnected } = useMbWallet();
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
    fetchCampaignFromArtAPI(campaignId, page, limit);
  }, [campaignId, page, limit]);
  const SpecialWinnerCount = campaign?.specialWinnerCount ?? "";

  console.log("log log log", SpecialWinnerCount);

  const handlePageClick = (newPage: number) => {
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
        if (analyticsData) {
          setCampaignAnalytics(analyticsData);
  
          const participantNames = analyticsData.uniqueWallets.map(
            (wallet: { firstName: string; lastName: string }) => 
              `${wallet.firstName} ${wallet.lastName}`
          );
  
          setParticipants(participantNames);
        } else {
          console.warn("No analytics data returned");
        }
      } catch (error) {
        console.error("Error fetching campaign analytics:", error);
      }
    };
  
    fetchAnalytics();
  }, [fetchCampaignAnalytics, campaignId]);
  

  useEffect(() => {
    console.log("Updated participants:", participants);
  }, [participants]);
  const { battles, fetchBattles } = useCampaigns(idToken);
  useEffect(() => {
    if (campaignId) {
      fetchBattles(campaignId)
        .then((data) => {
          if (data && data.pastBattles) {
            console.log("Fetched battles:", data.pastBattles);
            setDayWinners(data.pastBattles);
          } else {
            console.warn("No past battles found or data is null:", data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch battles:", error);
        });
    }
  }, [campaignId, fetchBattles]);

  const toggleSelection = (index: number) => {
    setSelectedArt((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const { distributeArt } = useCampaigns(idToken);

  const handleDistribute = async () => {
    const artList = selectedArt.map((index) => art[index]);
    const result = await distributeArt(campaignId, artList);
    if (result) {
      console.log("Success!");
    } else {
      console.error("Failed to distribute art");
    }
  };

  const handlePopups = () => {
    if (selectedArt.length === art.length) {
      setShowAllParticipantsPopup(true);
      setShowRewardModal(false);
    } else {
      setShowFewParticipantsPopup(true);
    }
    setShowRewardModal(false);
  };
  const isCreator = campaign?.creatorId === activeAccountId;
  return (
    <div className="campaign-details-container">
      <h1>Campaign Ended</h1>

      <div className="art-section">
        <div className="flex items-center justify-center gap-[25px] md:gap-[30px]">
          <div className="art-container">
            <h3 className="art-heading">Most Collected Art</h3>
            <div className="common">
              <div className="art">
                {campaignAnalytics?.mostVotedArt.map((art, index) => (
                  <div key={index}>
                    <div
                      className="flex items-center"
                      style={{ marginBottom: "10px" }}
                    >
                      <img
                        src=""
                        alt={art.arttitle}
                        className="profile-image"
                      />
                      <h4 style={{ margin: 0 }}>
                        {art.artistId && art.artistId.length > 10
                          ? `${art.artistId.slice(0, 10)}...`
                          : art.artistId || "Unknown Artist"}
                      </h4>
                    </div>

                    <img
                      src={art.colouredArt}
                      alt={art.arttitle}
                      className="art-image"
                    />
                    <p
                      className="flex items-center justify-end"
                      style={{ width: "100%", marginTop: "15px" }}
                    >
                      <InlineSVG
                        className="heart-icon"
                        src="/icons/red-heart.svg"
                        style={{ marginRight: "2px" }}
                      />
                      {art.raffleTickets} Upvotes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="art-details">
          <div>
            <h3>Total Votes</h3>
            <p>{campaignAnalytics?.totalRaffle}</p>
          </div>
          <div>
            <h3>Total Participants</h3>
            <p>{campaignAnalytics?.totalParticipants}</p>
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
          {campaignAnalytics?.specialWinnerArts.map((special, index) => (
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
                  <h4 style={{ margin: 0 }}>
                    {special.artistId.length > 10
                      ? `${special.artistId.substring(0, 10)}...`
                      : special.artistId}
                  </h4>
                </div>
                <img src={special.colouredArt} className="image" />

                <p
                  className="flex items-center justify-end"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <InlineSVG
                    src="/icons/red-heart.svg"
                    style={{ marginRight: "2px" }}
                    className="heart-icon"
                  />
                  {special.raffleTickets} Upvotes
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="daywise-winners">
        <h2>Day Wise Winners</h2>
        <div className="daywise-winners-grid">
          {dayWinners.map((battle: DayWinner, index: number) => {
            const isArtAWinner = battle.winningArt === "Art A";
            const winnerTitle = isArtAWinner
              ? battle.artAtitle
              : battle.artBtitle;
            const winnerImage = isArtAWinner
              ? battle.artAcolouredArt
              : battle.artBcolouredArt;
            const winnerArtist = isArtAWinner
              ? battle.artAartistId
              : battle.artBartistId;
            const upvotes = isArtAWinner ? battle.artAVotes : battle.artBVotes;

            return (
              <div className="common" key={battle._id}>
                <div className="daywise-winner">
                  <h3>Winner: Day {index + 1}</h3>
                  <div className="profile-section">
                    <img src="" alt="Profile" className="profile-image" />
                    <h4>
                      {winnerArtist.length > 10
                        ? `${winnerArtist.slice(0, 10)}...`
                        : winnerArtist}
                    </h4>
                  </div>
                  <img
                    src={winnerImage}
                    alt={winnerTitle}
                    className="art-img"
                  />
                  <p
                    className="flex items-center justify-end"
                    style={{ width: "100%", marginTop: "15px" }}
                  >
                    <InlineSVG
                      src="/icons/red-heart.svg"
                      style={{ marginRight: "2px" }}
                      className="heart-icon"
                    />
                    {upvotes} Upvotes
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="summary-container">
        <h2 className="summary-heading">Summary</h2>
        {isCreator && (
          <>
            <p className="summary-text">
              Distribute special rewards before 7 days of campaign ending date
            </p>
            <div className="distribute-btn-Wrapper">
              <button
                className="distribute-btn "
                onClick={() => setShowRewardModal(true)}
              >
                Distribute Rewards
              </button>

              <div className="distribute-btn-Border" />

              <div className="distribute-btn-Overlay" />
            </div>
          </>
        )}
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
            {showRewardModal && (
              <DistributeRewardPopup
                campaignId={campaignId}
                onClose={() => setShowRewardModal(false)}
                art={art}
                idToken={idToken}
                selectedArt={selectedArt}
                toggleSelection={toggleSelection}
                handlePopups={handlePopups}
                SpecialWinnerCount={SpecialWinnerCount}
              />
            )}
            {showAllParticipantsPopup && (
              <AllParticipantpopup
                onClose={() => setShowAllParticipantsPopup(false)}
                onDistribute={handleDistribute}
                selectedArtLength={selectedArt.length}
                artLength={art.length}
              />
            )}
            {showFewParticipantsPopup && (
              <FewParticipantsPopup
                onClose={() => setShowFewParticipantsPopup(false)}
                onDistribute={handleDistribute}
                selectedArtLength={selectedArt.length}
                artLength={art.length}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CampaignDetails;
