"use client";
import { NearWalletConnector } from "@/components/NearWalletConnector";
import { useFetchCampaignByTitle, CampaignData } from "@/hooks/campaignHooks";
import { useEffect, useState } from "react";
import ArtBattle from "@/components/ArtBattle";
import UpcomingBattlesTable from "@/components/UpcomingBattlesTable";
import PreviousArtTable from "@/components/PreviousBattlesTable";
import Footer from "@/components/Footer";
import ArtworkUploadForm from "@/components/ArtworkUploadForm";

const Campaign = ({ params }: { params: { campaign: string } }) => {
  const [campaign, setCampaign] = useState<CampaignData>();
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"video" | "image">("image");

  const { fetchCampaignByTitle } = useFetchCampaignByTitle();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCampaignByTitle(params.campaign);
      setCampaign(data);
      
      if (data.video) {
        const videoBlob = base64ToBlob(data.video, "video/mp4");
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        setMediaUrl(videoObjectUrl);
        setMediaType("video");
      } else if (data.image) {
        const imageBlob = base64ToBlob(data.image, "image/jpeg");
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setMediaUrl(imageObjectUrl);
        setMediaType("image");
      }
    };
    fetchData();
    console.log(mediaUrl)
  }, [params.campaign]);

  const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  // if(!campaign){
  //   return <>No campaign</>
  // }

  return (
    <main
      className="flex flex-col justify-center"
      style={{
        width: "100vw",
        backgroundPosition: "top",
        backgroundSize: "cover",
        overflowX: "hidden",
        overflowY: "auto"
      }}
    >
      {mediaUrl && mediaType === "video" && (
        <video
          autoPlay
          muted
          loop
          id="background-video"
          style={{
            position: "fixed",
            right: 0,
            bottom: 0,
            objectFit: "cover",
            minWidth: "100%",
            minHeight: "100%",
            zIndex: -1,
            filter: "blur(5px) brightness(50%)"
          }}
        >
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {mediaUrl && mediaType === "image" && (
        <img
          src={mediaUrl}
          alt="Campaign background"
          style={{
            position: "fixed",
            right: 0,
            bottom: 0,
            objectFit: "cover",
            minWidth: "100%",
            minHeight: "100%",
            zIndex: -1,
            filter: "blur(5px) brightness(50%)"
          }}
        />
      )}
      <NearWalletConnector />
      {showUploadModal && campaign?._id && (
        <ArtworkUploadForm
          campaignId={campaign?._id}
          onClose={() => setShowUploadModal(false)}
          onSuccessUpload={() => setUploadSuccess(true)}
        />
      )}
      <ArtBattle
        campaignId={campaign?._id as string}
        toggleUploadModal={toggleUploadModal}
      />
      <UpcomingBattlesTable
        campaignId={campaign?._id as string}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
      <PreviousArtTable
        campaignId={campaign?._id as string}
        toggleUploadModal={toggleUploadModal}
      />
      <Footer />
    </main>
  );
};

export default Campaign;
