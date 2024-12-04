"use client";
import { useContext, useEffect, useState } from "react";
import { CampaignData } from "@/hooks/campaignHooks";
import useCampaigns, { CampaignPageData } from "@/hooks/CampaignHook";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import { Header } from "@/components/Header/Header";
import InlineSVG from "react-inlinesvg";
import CampaignHeader from "@/components/Campaign page/Campaign Header/CampaignHeader";

import CurrentCampaigUploadArt from "@/components/Campaign page/Current Campaign/CurrentCampaign";
import { UpcomingGrid } from "@/components/ArtBattle/UpcomingArts/UpcomingGrid/UpcomingGrid";
import PreviousArtHeader from "@/components/ArtBattle/PreviousArts/PreviousArtHeader";
import { PreviousGrid } from "@/components/ArtBattle/PreviousArts/PreviousGrid/PreviousGrid";
import { GFX_CAMPAIGNID } from "@/config/constants";
import Footer from "@/components/Footer/Footer";
import CampaignTime from "@/components/Campaign page/Campaign Timing/CampaignTime";
import FewParticipantsPopup from "@/components/Campaign page/DistributeReward Popup/FewParticipants";
import AllParticipantpopup from "@/components/Campaign page/DistributeReward Popup/AllParticipants";
import DistributeRewardPopup from "@/components/Campaign page/DistributeReward Popup/DistributePopup";
import { Battle } from "@/components/ArtBattle/Battle/Battle";
import { useSession, signIn } from "next-auth/react";
import Loader from "@/components/ArtBattle/Loader/Loader";
import ArtUploadForm from "@/components/ArtUpload/ArtUploadForm";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { useSendWalletData } from "@/hooks/saveUserHook";
import { setAuthToken } from "../../../utils/authToken";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import NoPage from "@/components/404 Page/NoPage";
import { BattleData, useFetchTodayBattle } from "@/hooks/battleHooks";
import { useAuth } from "@/contexts/AuthContext";
import { WalletConnectPopup } from "@/components/PopUps/WalletConnectPopup";
import { NearContext } from "@/wallet/WalletSelector";
import usePostNearDrop from "@/hooks/NearDrop";
import { ClaimPopup } from "@/components/PopUps/ClaimPopup";
interface ArtData {
  tokenId: number;
  artistId: string;
  artistName:string;
  arttitle: string;
  colouredArt: string;
  grayScale: string;
  raffleTickets: number;
  email: string;
}

interface CampaignAnalytics {
  totalRaffle: number;
  totalParticipants: number;
  totalUploadedarts: number;
  totalUpVotes: number;
  totalUniqueWallets: number;
  uniqueWallets: number[];
  mostVotedArt: ArtData[];
  mostUpVotedArt: ArtData[];
  specialWinnerArts: ArtData[];
}
const Campaign = ({ params }: { params: { campaign: string } }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [editCampaign, setEditCampaign] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState<
    boolean | null
  >(null);
  const { data: session, status } = useSession();
  // const [user, setUser] = useState<any>();
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const { wallet, signedAccountId } = useContext(NearContext);
  // const { postNearDrop, response } = usePostNearDrop();

  const [successToast, setSuccessToast] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [campaignAnalytics, setCampaignAnalytics] =
    useState<CampaignAnalytics | null>(null);
  const [participantsList, setParticipantsList] = useState<string[]>([]);
  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
  }, [toast]);

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     // Redirect to login if not authenticated
  //     signIn("azure-ad-b2c", { callbackUrl: "/" });
  //   } else if (status === "authenticated" && session) {
  //     // Set the idToken for all API requests
  //     setAuthToken(session?.idToken || "");
  //     console.log("Token set for API requests", session);
  //   }
  // }, [status, session]);

  const {
    fetchCampaignByTitle,
    campaignStatus,
    campaign,
    isLoading,
    isError,
    participants,
    setIsLoading,
    fetchCampaignAnalytics,
  } = useCampaigns();
  const {
    user,
    userTrigger,
    setUserTrigger,
    newUser,
    setNewUser,
    nearDrop,
    setNearDrop,
  } = useAuth();
  let userDetails = user;
  useEffect(() => {
    if (!campaign || !campaign.startDate) return;

    const startDate = new Date(campaign.startDate).getTime();
    const endDate = campaign.endDate
      ? new Date(campaign.endDate).getTime()
      : null;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeLeft = startDate - now;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        clearInterval(timerId);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [campaign]);
  useEffect(() => {
    if (campaignStatus !== "completed" || !campaign?._id) return;

    const fetchAnalytics = async () => {
      try {
        const analyticsData = await fetchCampaignAnalytics(campaign._id);
        if (analyticsData) {
          setCampaignAnalytics(analyticsData);

          const participantNames = analyticsData.uniqueWallets.map(
            (wallet: { firstName: string; lastName: string }) =>
              `${wallet.firstName} ${wallet.lastName}`
          );

          setParticipantsList(participantNames);
        } else {
          console.warn("No analytics data returned");
        }
      } catch (error) {
        console.error("Error fetching campaign analytics:", error);
      }
    };

    fetchAnalytics();
  }, [campaign?._id, campaignStatus]);

  useEffect(() => {
    console.log("Fetching campaign with the following details:");
    console.log("Campaign:", params.campaign);

    const simulateLoading = async () => {
      setIsLoading(true);
      await fetchCampaignByTitle(params.campaign);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      setIsLoading(false);
    };

    simulateLoading();
  }, [params.campaign, editCampaign]);

  console.log("Participants:", participants);
  const { todayBattle, loading, battle, error, fetchTodayBattle } =
    useFetchTodayBattle();
  useEffect(() => {
    const fetchBattle = async () => {
      await fetchTodayBattle(campaign?._id as string);
    };

    const timeoutId = setTimeout(() => {
      fetchBattle();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [campaign?._id as string]);
  // useEffect(() => {
  //   const triggerNearDrop = async () => {
  //     if (signedAccountId && userDetails?.user?.isNearDropClaimed === false) {
  //       try {
  //         const payload = { nearAddress: signedAccountId };
  //         await postNearDrop(payload);
  //         setUserTrigger(!userTrigger);
  //         setNearDrop(true);
  //         console.log("Near drop triggered successfully.");
  //       } catch (error) {
  //         console.error("Error triggering near drop:", error);
  //       }
  //     }
  //   };

  //   triggerNearDrop();
  // }, [signedAccountId, userDetails, userTrigger]);
  // useEffect(() => {
  //   const handleWalletData = async () => {
  //     if (session && session.user) {
  //       const idToken = session.idToken as string;
  //       console.log("ID Token:", idToken);

  //       const walletAddress = activeAccountId;
  //       if (!walletAddress) {
  //         console.warn("No wallet address available.");
  //         return;
  //       }

  //       console.log("Wallet Address:", walletAddress);

  //       try {
  //         const user = await sendWalletData();
  //         if (user !== null) {
  //           console.log("USER:", user);
  //           setUser(user);
  //         }
  //       } catch (err) {
  //         console.error("Failed to send wallet data:", err);
  //       }
  //     } else {
  //       console.warn("Session or user information is missing.");
  //     }
  //   };

  //   handleWalletData();
  // }, [session, activeAccountId]);

  if (loading)
    return (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader md="22" sm="15" />
      </div>
    );
  if (isError) return <div>No campaign found</div>;
  const handleNavigation = () => {
    window.location.href = "/campaign";
  };

  const toggleDistributeModal = () => {
    setShowDistributeModal(!showDistributeModal);
  };

  const creatorEmail = campaign?.email;
  const activeEmail = userDetails?.user?.email;

  const handleButtonClick = () => {
    if (creatorEmail === activeEmail) {
      setShowEditModal(true);
    } else {
      setShowUploadModal(true);
    }
  };
  return (
    <div style={{ backgroundColor: "#000000", width: "100%", height: "100vh" }}>
      {campaignStatus === "current" && (
        <div style={{ backgroundColor: "#000000" }}>
          <Header
            openNav={openNav}
            setOpenNav={setOpenNav}
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
            setWalletMismatchPopup={setWalletMismatchPopup}
          />
          <div className="camapign-path-container flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center">
              <button className="camapign-path-button">GFXvs</button>
              <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
              <h3
                style={{
                  color: "#ffffff",

                  cursor: "pointer",
                }}
                onClick={handleNavigation}
              >
                Campaigns
              </h3>
              <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
              <h3 style={{ color: "#00ff00", textDecoration: "underline" }}>
                Current Campaign
              </h3>
            </div>
            <div className="campaign-status flex items-center gap-2">
              <span className="hidden md:flex">Campaign:</span>
              <div className="publicStatus text-xs">
                {campaign?.publiclyVisible ? "Public" : "Private"}
              </div>
            </div>
          </div>
          <CampaignHeader
            campaign={campaign}
            status={status}
            participantsCount={participants}
          />
          <Battle
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
            fontColor={""}
            welcomeText={""}
            themeTitle={""}
            todayBattle={todayBattle}
            loading={loading}
            error={error}
          />
          {todayBattle && (
            <CurrentCampaigUploadArt
              toggleUploadModal={toggleUploadModal}
              uploadSuccess={uploadSuccess}
            />
          )}
          {showUploadModal && (
            <ArtUploadForm
              campaignId={campaign?._id as string}
              onClose={() => setShowUploadModal(false)}
              onSuccessUpload={() => setUploadSuccess(true)}
              setSignToast={setSignToast}
              setErrMsg={setErrMsg}
              setToast={setToast}
              setSuccessToast={setSuccessToast}
              setToastMessage={setToastMessage}
            />
          )}
          <UpcomingGrid
            fontColor={""}
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            adminEmail={campaign?.email as string}
            showUploadModal={showUploadModal}
          />
          {/* <PreviousArtHeader />
          <PreviousGrid
            fontColor={""}
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
          /> */}

          <FooterMenu
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
          />
          <MobileNav
            openNav={openNav}
            setOpenNav={setOpenNav}
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
          />
          {walltMisMatchPopup && (
            <WalletConnectPopup onClose={() => setWalletMismatchPopup(false)} />
          )}
        </div>
      )}
      {campaignStatus === "upcoming" && (
        <div style={{ backgroundColor: "#000000" }}>
          <Header
            openNav={openNav}
            setOpenNav={setOpenNav}
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
            setWalletMismatchPopup={setWalletMismatchPopup}
          />
          <div className="camapign-path-container flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center">
              <button className="camapign-path-button">GFXvs</button>
              <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
              <h3
                style={{
                  color: "#ffffff",

                  cursor: "pointer",
                }}
                onClick={handleNavigation}
              >
                Campaigns
              </h3>

              <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
              <h3 style={{ color: "#00ff00", textDecoration: "underline" }}>
                Upcoming Campaign
              </h3>
            </div>
            <div className="campaign-status flex items-center gap-2">
              <span className="hidden md:flex">Campaign:</span>
              <div className="publicStatus text-xs">
                {campaign?.publiclyVisible ? "Public" : "Private"}
              </div>
            </div>
          </div>
          <CampaignHeader
            campaign={campaign}
            status={campaignStatus}
            participantsCount={participants}
          />
          <CampaignTime
            campaign={campaign}
            campaignId={campaign?._id as string}
            editCampaign={editCampaign}
            setEditCampaign={setEditCampaign}
            timeRemaining={timeRemaining}
            creatorEmail={creatorEmail}
            activeEmail={activeEmail}
            handleButtonClick={handleButtonClick}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            showUploadModal={showUploadModal}
            setShowUploadModal={setShowUploadModal}
          />

          {/* <PreviousGrid
            fontColor={""}
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
          /> */}
          <UpcomingGrid
            fontColor={""}
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            adminEmail={campaign?.email as string}
            showUploadModal={showUploadModal}
          />

          <FooterMenu
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
          />
          <MobileNav
            openNav={openNav}
            setOpenNav={setOpenNav}
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
          />
          {walltMisMatchPopup && (
            <WalletConnectPopup onClose={() => setWalletMismatchPopup(false)} />
          )}
          {nearDrop && (
            <ClaimPopup
              msg="Reward unlocked! You've earned 10 NearDrop points!"
              onClose={() => setNearDrop(false)}
            />
          )}
        </div>
      )}
      {campaignStatus === "completed" && (
        <div
          style={{ width: "100%", minHeight: "100vh", background: "#000000" }}
        >
          <Header
            openNav={openNav}
            setOpenNav={setOpenNav}
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
            setWalletMismatchPopup={setWalletMismatchPopup}
          />
          <div className="camapign-path-container flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center">
              <button className="camapign-path-button">GFXvs</button>
              <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
              <h3
                style={{ color: "#ffffff", cursor: "pointer" }}
                onClick={handleNavigation}
              >
                Campaigns
              </h3>
              <InlineSVG src="/icons/green-arrow.svg" className="arrow-icon" />
              <h3 style={{ color: "#00ff00", textDecoration: "underline" }}>
                Completed Campaign
              </h3>
            </div>
            <div className="campaign-status flex items-center gap-2">
              <span className="hidden md:flex">Campaign:</span>
              <div className="publicStatus text-xs">
                {campaign?.publiclyVisible ? "Public" : "Private"}
              </div>
            </div>
          </div>
          <CampaignHeader
            campaign={campaign}
            status={status}
            participantsCount={participants}
          />
          <CampaignDetails
            toggleDistributeModal={toggleDistributeModal}
            campaignId={campaign?._id as string}
            campaign={campaign}
            campaignAnalytics={campaignAnalytics}
            participantsList={participantsList}
          />

          {/* {showDistributeModal && (
            <DistributeRewardPopup
              onDistribute={() => handleDistribute(true)}
              onClose={() => setShowDistributeModal(false)}
            />
          )} */}

          {/* {showAllParticipants === true && (
            <AllParticipantpopup onClose={() => setShowAllParticipants(null)} />
          )}
          {showAllParticipants === false && (
            <FewParticipantsPopup
              onClose={() => setShowAllParticipants(null)}
            />
          )} */}

          <FooterMenu
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
          />
          <MobileNav
            openNav={openNav}
            setOpenNav={setOpenNav}
            fontColor={""}
            campaignId={GFX_CAMPAIGNID}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
            setSignToast={setSignToast}
            setErrMsg={setErrMsg}
          />
          {walltMisMatchPopup && (
            <WalletConnectPopup onClose={() => setWalletMismatchPopup(false)} />
          )}
        </div>
      )}
      {!["current", "upcoming", "completed"].includes(campaignStatus ?? "") && (
        <main className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]">
          <NoPage />
        </main>
      )}
    </div>
  );
};

export default Campaign;
