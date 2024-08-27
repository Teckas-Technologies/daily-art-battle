"use client";
import { NearWalletConnector } from "@/components/NearWalletConnector";
import { useFetchCampaignByTitle, CampaignData } from "@/hooks/campaignHooks";
import { useEffect, useState } from "react";
import ArtBattle from "@/components/ArtBattle";
import UpcomingBattlesTable from "@/components/UpcomingBattlesTable";
import PreviousArtTable from "@/components/PreviousBattlesTable";
import Footer from "@/components/Footer";
import ArtworkUploadForm from "@/components/ArtworkUploadForm";
import { Navbar } from "./Navbar";

const Campaign = ({ params }: { params: { campaign: string } }) => {
  const [campaign, setCampaign] = useState<CampaignData>();
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<string>("");
  const { fetchCampaignByTitle } = useFetchCampaignByTitle();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCampaignByTitle(params.campaign);
      setCampaign(data);
      setMediaUrl(data.video)
      
      if (data.video) {
        
        // Set media type based on the file extension
        const response = await fetch(data.video);
        const blob = await response.blob();
        const mimeType = await determineMimeType(blob);
        const type = mimeType.split("/");
        setMediaType(type[0]);
      }
    };
    fetchData();
    console.log(mediaUrl)
  }, [params.campaign]);

  const determineMimeType = async (blob: Blob): Promise<string> => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const bytes = new Uint8Array(arrayBuffer);
            const signature = bytes.slice(0, 4).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
            
            // Compare with known signatures
            if (signature.startsWith('ffd8')) return resolve('image/jpeg');
            if (signature.startsWith('8950')) return resolve('image/png');
            if (signature.startsWith('4749')) return resolve('image/gif');
            if (signature.startsWith('0000')) return resolve('video/mp4');
            
            // Fallback or unknown type
            resolve('application/octet-stream');
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob.slice(0, 4)); // Read the first 4 bytes
    });
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
      {mediaType === "video" && (
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
        <source src={campaign?.video as string} type="video/mp4" />
        Your browser does not support the video tag.
    </video>
       )} 
      {mediaType === "image" && (
        <img
          src={campaign?.video as string}
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
      {mediaType===""&&(
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
                <source src="images/back.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
      )}
      <Navbar/>
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
