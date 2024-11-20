"use client";
import InlineSVG from "react-inlinesvg";
import "./CampaignDetails.css";
import { useContext, useEffect, useRef, useState } from "react";
import { BattleData, useFetchBattles } from "@/hooks/battleHooks";
import useCampaigns, { CampaignPageData } from "@/hooks/CampaignHook";
import { useSession, signIn } from "next-auth/react";
import DistributeRewardPopup from "../DistributeReward Popup/DistributePopup";
import FewParticipantsPopup from "../DistributeReward Popup/FewParticipants";
import AllParticipantpopup from "../DistributeReward Popup/AllParticipants";
import { NearContext } from "@/wallet/WalletSelector";
import Toast from "@/components/Toast";

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
  const [limit, setLimit] = useState(6);
  const [arts, setArts] = useState<ArtData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [campaignAnalytics, setCampaignAnalytics] =
    useState<CampaignAnalytics | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [dayWinners, setDayWinners] = useState([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isRewardDistributed, setIsRewardDistributed] = useState(
    campaign?.distributedRewards ?? false
  );
  const [selectedArt, setSelectedArt] = useState<number[]>([]);
  const [showAllParticipantsPopup, setShowAllParticipantsPopup] =
    useState(false);
  const [showFewParticipantsPopup, setShowFewParticipantsPopup] =
    useState(false);
  const [specialWinnerCount, setSpecialWinnerCount] = useState<number | null>(
    null
  );
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const { wallet, signedAccountId } = useContext(NearContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  const idToken = session?.idToken || "";
  const {
    fetchCampaignAnalytics,
    fetchCampaignFromArtAPI,
    art,
    totalDocuments,
    loading,
  } = useCampaigns();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchArt = await fetchCampaignFromArtAPI(
          campaignId,
          currentPage,
          limit
        );
        setArts(fetchArt.arts);
        setTotalPages(fetchArt.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [campaignId, currentPage, limit, session?.idToken]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const SpecialWinnerCount = campaign?.specialWinnerCount ?? "";

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
  }, [campaignId]);

  useEffect(() => {
    console.log("Updated participants:", participants);
  }, [participants]);
  const { battles, fetchBattles } = useCampaigns();
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
  }, [campaignId]);

  const toggleSelection = (index: number) => {
    setSelectedArt((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const { distributeArt } = useCampaigns();

  const handleDistribute = async () => {
    const artList = selectedArt.map((index) => art[index]);
    const result = await distributeArt(campaignId, artList);
    if (result) {
      console.log("Success!");
      setIsRewardDistributed(true);
      setShowAllParticipantsPopup(false);
      setShowFewParticipantsPopup(false);
      setToastMessage("Reward distributed successfully");
      setSuccessToast("yes");
      setToast(true);
    } else {
      console.error("Failed to distribute art");
      setToastMessage("Failed to distribute reward");
      setSuccessToast("no");
      setToast(true);
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
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 3;

    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const isCreator = campaign?.creatorId === signedAccountId;
  return (
    <div className="campaign-details-container">
      <h1>Campaign Ended</h1>

      <div className="art-section">
        <div className="flex items-center justify-center gap-[25px] md:gap-[30px]">
          {campaignAnalytics &&
            campaignAnalytics.mostVotedArt &&
            campaignAnalytics.mostVotedArt.length > 0 && (
              <div className="art-container">
                <h3 className="art-heading">Most Collected Art</h3>
                <div className="common">
                  <div className="art">
                    {campaignAnalytics.mostVotedArt.map((art, index) => (
                      <div key={index}>
                        <div
                          className="flex items-center"
                          style={{ marginBottom: "10px" }}
                        >
                          <img
                            src="images/no-profile.png"
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
                          {art.raffleTickets} Collects
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
        {campaignAnalytics?.specialWinnerArts &&
          campaignAnalytics.specialWinnerArts.length > 0 && (
            <>
              <h2>Special Rewards Winners</h2>

              <div className="winnersGrid">
                {campaignAnalytics.specialWinnerArts.map((special, index) => (
                  <div className="common" key={index}>
                    <div className="winner">
                      <div
                        className="flex items-center"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src="images/no-profile.png"
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
                        {special.raffleTickets} Collects
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>

      <div className="daywise-winners">
        {dayWinners.length > 0 && (
          <>
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
                const upvotes = isArtAWinner
                  ? battle.artAVotes
                  : battle.artBVotes;

                return (
                  <div className="common" key={battle._id}>
                    <div className="daywise-winner">
                      <h3>Winner: Day {index + 1}</h3>
                      <div className="profile-section">
                        <img
                          src="images/no-profile.png"
                          alt="Profile"
                          className="profile-image"
                        />
                        <h4>
                          {winnerArtist.length > 10
                            ? `${winnerArtist.slice(0, 10)}...`
                            : winnerArtist}
                        </h4>
                      </div>
                      <img
                        src={winnerImage}
                        alt={winnerTitle}
                        className="art-img-campaign"
                      />
                      <p className="flex items-center justify-end mt-3">
                        <InlineSVG
                          src="/icons/red-heart.svg"
                          className="heart-icon mr-1"
                        />
                        {upvotes} Collects
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="summary-container">
        {campaignAnalytics?.totalParticipants ? (
          <>
            <h2 className="summary-heading">Summary</h2>
            {isCreator && (
              <>
                <p className="summary-text">
                  Distribute special rewards before 7 days of campaign ending
                  date
                </p>
                <div
                  className="distribute-btn-Wrapper "
                  ref={scrollRef}
                  id="top"
                >
                  <button
                    className="distribute-btn "
                    onClick={() => setShowRewardModal(true)}
                    disabled={isRewardDistributed}
                    style={{
                      cursor: isRewardDistributed ? "not-allowed" : "pointer",
                    }}
                  >
                    {isRewardDistributed
                      ? "Reward Distributed"
                      : "Distribute Reward"}
                  </button>

                  <div className="distribute-btn-Border" />

                  <div className="distribute-btn-Overlay" />
                </div>
              </>
            )}
          </>
        ) : (
          ""
        )}
        <div className="summary mt-6">
          <div className="participants">
            <h2>Participants</h2>
            {participants && participants.length > 0 ? (
              participants.map((participant, index) => (
                <div
                  key={index}
                  className="participant"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div className="flex flex-row items-center justify-center">
                    <span className="participant-number">{index + 1}</span>
                    <span className="participant-name">{participant}</span>
                  </div>
                </div>
              ))
            ) : (
              <div>No participants available.</div>
            )}
          </div>

          <div className="summary-arts">
            {art.length > 0 ? (
              <>
                <h3>Arts</h3>
                <div className="arts-grid">
                  {art.map((artItem, index) => (
                    <div key={index} className="art-card">
                      <img src={artItem.colouredArt} alt={`Art ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
             <p className="flex items-center justify-center gap-2 mt-[60px] mb-[30px] text-white font-semibold text-lg">
            <InlineSVG
              src="/icons/info.svg"
              className="fill-current text-white font-bold point-c w-4 h-4 cursor-pointer"
            />{" "}
            No arts available!
          </p>
            )}

            {art.length > 0 && (
              <div className="pagination-section relative w-full flex justify-center py-5">
                <div className="pagination rounded-[7rem]">
                  <div className="w-auto flex items-center justify-center md:gap-[2rem] gap-[1rem] px-7 py-3 rounded-[7rem] bg-black">
                    <div
                      className={`previous flex items-center gap-1 ${
                        currentPage === 1
                          ? "cursor-not-allowed opacity-50 text-gray-400"
                          : "cursor-pointer text-white"
                      }`}
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      <InlineSVG
                        src="/icons/left-arrow.svg"
                        className="w-3 h-3 spartan-light"
                      />
                      <h2 className="hidden md:block">Previous</h2>
                    </div>

                    <div className="page-numbers flex items-center justify-center gap-2">
                      {renderPageNumbers().map((pageNumber: number) => (
                        <div
                          key={pageNumber}
                          className={`page-number md:h-[3rem] md:w-[3rem] h-[2rem] w-[2rem] flex justify-center items-center rounded-full cursor-pointer ${
                            currentPage === pageNumber ? "active-page" : ""
                          }`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          <h2>{pageNumber}</h2>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`next flex items-center gap-1 ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-50 text-gray-400"
                          : "cursor-pointer text-white"
                      }`}
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
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
            isLoading={isLoading}
          />
        )}
      </div>
      {toast && toastMessage && (
        <div
          className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden"
          style={{ zIndex: 55 }}
        >
          <div className="relative w-full h-full">
            <Toast
              success={successToast === "yes" ? true : false}
              message={toastMessage}
              onClose={() => {
                setToast(false);
                setToastMessage("");
                setSuccessToast("");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default CampaignDetails;
