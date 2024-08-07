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
  const [videoUrl, setVideoUrl] = useState<string>("");

  const { fetchCampaignByTitle } = useFetchCampaignByTitle();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCampaignByTitle(params.campaign);
      setCampaign(data);
      if (data.video) {
        const videoBlob = base64ToBlob(data.video, 'video/mp4');
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoObjectUrl);
      }
    };
    fetchData();
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

  return (
    <main
      className="flex flex-col justify-center"
      style={{
        width: '100vw',
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
    >
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          id="background-video"
          style={{
            position: 'fixed',
            right: 0,
            bottom: 0,
            objectFit: 'cover',
            minWidth: '100%',
            minHeight: '100%',
            zIndex: -1,
            filter: 'blur(5px) brightness(50%)'
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <NearWalletConnector />
      {showUploadModal && <ArtworkUploadForm onClose={() => setShowUploadModal(false)} onSuccessUpload={() => setUploadSuccess(true)} />}
      <ArtBattle toggleUploadModal={toggleUploadModal} />
      <UpcomingBattlesTable toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
      <PreviousArtTable toggleUploadModal={toggleUploadModal}/>
      <Footer/>
      
    </main>
  );
};

export default Campaign;
