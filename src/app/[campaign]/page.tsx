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
  const [mediaType, setMediaType] = useState<string>("");
  const { fetchCampaignByTitle } = useFetchCampaignByTitle();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCampaignByTitle(params.campaign);
      setCampaign(data);
      
      if (data.video) {
        const extension = data.video.split('.').pop()?.toLowerCase();
        // Set media type based on the file extension
        if (extension === "mp4" || extension === "webm" || extension === "ogg") {
          setMediaType("video");
          setMediaUrl(data.video)
        } else if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") {
          setMediaType("image");
          setMediaUrl(data.video)
         
        }
      }
    };
    fetchData();
    console.log(mediaUrl)
  }, [params.campaign]);


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
       <video autoPlay muted loop id="background-video" style={{ 
        position: 'fixed', 
        right: 0, 
        bottom: 0, 
        objectFit: 'cover', 
        minWidth: '100%', 
        minHeight: '100%', 
        zIndex: -1,
        filter: 'blur(5px) brightness(50%)'
    }}>
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
        fontColor={campaign?.color as string}
        welcomeText={campaign?.campaignWelcomeText as string}
        themeTitle={campaign?.campaignTheme as string}
        toggleUploadModal={toggleUploadModal}
      />
      <UpcomingBattlesTable
        campaignId={campaign?._id as string}
        fontColor={campaign?.color as string}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
      />
      <PreviousArtTable
        campaignId={campaign?._id as string}
        fontColor={campaign?.color as string}
        toggleUploadModal={toggleUploadModal}
      />
      <Footer />
    </main>
  );
};

export default Campaign;
