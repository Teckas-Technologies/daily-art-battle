"use client"
import { useState } from "react";
import { Header } from "@/components/Header/Header";
import useMintImage from "@/hooks/useMint";
import { GFX_CAMPAIGNID } from "@/config/constants";

export default function LoginPage() {
    const [openNav, setOpenNav] = useState(false);
    // const { leaderBoard, totalPage, fetchLeaderBoard } = useLeaderBoard();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const[call,setCall]=useState(false);
    // const { data: session, status } = useSession();
    const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
const {mintImage}= useMintImage();
const mint = async()=>{
    const mintObj = {
        title: "cat",
        mediaUrl: "https://arweave.net/WPQbUMWSZhGtINES3qDsAKvFfVzrygHUhI9DQYhmUg0",
        referenceUrl:"https://arweave.net/GO3yDW_zvD9S_890z6dqyE4uOhnM0SlCu4Ee9i6TxLc",
        count:4,
        contractId:"",
      };
    await mintImage(mintObj);
}
  return (
    <>
    <Header
    openNav={openNav}
    setOpenNav={setOpenNav}
    fontColor=""
    campaignId={GFX_CAMPAIGNID}
    toggleUploadModal={toggleUploadModal}
    uploadSuccess={uploadSuccess}
  />
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
 
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-6">Please log in using your Azure B2C account.</p>
        <button
          onClick={mint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login with Azure B2C
        </button>
      </div>
    </div>
    </>
  );
}
