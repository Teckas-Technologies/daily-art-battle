"use client";
import { useEffect, useState } from "react";
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

const Campaign = ({ params }: { params: { campaign: string } }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [editCampaign, setEditCampaign] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const { sendWalletData } = useSendWalletData();
  const [showAllParticipants, setShowAllParticipants] = useState<
    boolean | null
  >(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>();
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [toastMessage, setToastMessage] = useState("");

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
  } = useCampaigns();
  useEffect(() => {
    console.log("Fetching campaign with the following details:");
    console.log("Campaign:", params.campaign);

    fetchCampaignByTitle(params.campaign);
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
          />
          <div className="camapign-path-container">
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
          />
          <div className="camapign-path-container">
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
          <CampaignHeader
            campaign={campaign}
            status={campaignStatus}
            participantsCount={participants}
          />
          <CampaignTime
            campaign={campaign}
            campaignId={campaign?._id as string}
            setEditCampaign={setEditCampaign}
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
          />
          <div className="camapign-path-container">
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
          <CampaignHeader
            campaign={campaign}
            status={status}
            participantsCount={participants}
          />
          <CampaignDetails
            toggleDistributeModal={toggleDistributeModal}
            campaignId={campaign?._id as string}
            campaign={campaign}
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
