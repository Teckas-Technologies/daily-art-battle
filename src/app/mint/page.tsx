"use client"
import { useState } from "react";
import { Header } from "@/components/Header/Header";
import useMintImage from "@/hooks/useMint";
import { ART_BATTLE_CONTRACT, GFX_CAMPAIGNID } from "@/config/constants";

export default function LoginPage() {
    const [openNav, setOpenNav] = useState(false);
    // const { leaderBoard, totalPage, fetchLeaderBoard } = useLeaderBoard();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const[call,setCall]=useState(false);
    const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
    // const { data: session, status } = useSession();
    const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
const {mintImage,burnNft}= useMintImage();
const mint = async()=>{
    const mintObj = {
        title: "cat",
        mediaUrl: "https://arweave.net/LSL8mO8wgCtB3sboqv7MU1AR_twMrL6Jmhg1x8L-kEQ",
        referenceUrl:"https://arweave.net/gJ6RIlUexBQk13YWmlAKQAhx_hqVhbw8j6oI_CVulj4",
        count:4,
        contractId:ART_BATTLE_CONTRACT,
      };
    await mintImage(mintObj);
}


const burn = async()=>{
    const mintObj = {
        title: "cat",
        mediaUrl: "https://arweave.net/LSL8mO8wgCtB3sboqv7MU1AR_twMrL6Jmhg1x8L-kEQ",
        referenceUrl:"https://arweave.net/gJ6RIlUexBQk13YWmlAKQAhx_hqVhbw8j6oI_CVulj4",
        count:4,
        contractId:ART_BATTLE_CONTRACT,
      };
    await burnNft(5230);
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
    setSignToast={setSignToast} 
        setErrMsg={setErrMsg}
        setWalletMismatchPopup={setWalletMismatchPopup}
  />
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
 
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-6">Please log in using your Azure B2C account.</p>
        <button
          onClick={burn}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          burn
        </button>
      </div>
    </div>
    </>
  );
}
