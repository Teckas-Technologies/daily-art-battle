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
const Campaign = ({ params }: { params: { campaign: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState<
    boolean | null
  >(null);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("azure-ad-b2c", { callbackUrl: "/" });
    }

    console.log("status", status);
    console.log("session", session);
  }, [status, session]);
  const idToken = session?.idToken || "";

  const {
    fetchCampaignByTitle,
    campaignStatus,
    campaign,
    loading,
    error,
    participants,
  } = useCampaigns(idToken);

  useEffect(() => {
    fetchCampaignByTitle(params.campaign);
  }, [params.campaign, idToken]);

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
        <Loader />{" "}
      </div>
    );
  if (error) return <div>No campaign found</div>;
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
          <Header />
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
          />
          <CurrentCampaigUploadArt
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
          />
          {showUploadModal && (
            <ArtUploadForm
              campaignId={campaign?._id as string}
              onClose={() => setShowUploadModal(false)}
              onSuccessUpload={() => setUploadSuccess(true)}
            />
          )}
          <UpcomingGrid
            fontColor={""}
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
            uploadSuccess={uploadSuccess}
          />

          <FooterMenu />
        </div>
      )}
      {campaignStatus === "upcoming" && (
        <div style={{ backgroundColor: "#000000" }}>
          <Header />
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
          />
          <PreviousGrid
            fontColor={""}
            campaignId={campaign?._id as string}
            toggleUploadModal={toggleUploadModal}
          />

          <FooterMenu />
        </div>
      )}
      {campaignStatus === "completed" && (
        <div
          style={{ width: "100%", minHeight: "100vh", background: "#000000" }}
        >
          <Header />
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

          <FooterMenu />
        </div>
      )}
    </div>
  );
};

export default Campaign;