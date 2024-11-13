"use client"
import { useState ,useEffect} from "react";
import { Header } from "@/components/Header/Header";
import "../../components/LeaderBoard/LeaderBoard.css";
import LeaderboardHolders from "@/components/LeaderBoard/LeaderBoardHolders";
import { signIn, useSession } from "next-auth/react";
import { setAuthToken } from "../../../utils/authToken";
import LeaderboardCollectors from "@/components/LeaderBoard/LeaderBoardCollectors";
import LeaderboardCreators from "@/components/LeaderBoard/LeaderBoardCreators";
import { GFX_CAMPAIGNID } from "@/config/constants";
const LeaderBoardPage = ()=>{
const [activeTab, setActiveTab] = useState("GFXvs Point Holders");
    const [openNav, setOpenNav] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  const handleTabClick = (tab:any)=>{
    setActiveTab(tab);
  }
  
    return(
        <div className="bg-black w-full text-white min-h-screen flex flex-col">
        <Header openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} />
        <div className="flex-grow flex flex-col items-center justify-center pt-20 w-full px-4 text-center">
          <h1 className="spartan-semibold bg-clip-text text-center text-transparent mt-20 font-bold text-6xl bg-gradient-to-b from-[#00ff00] to-[#009900]">
            GFXvs Leaderboard
          </h1>
          </div>
          <div className="w-full px-3 ml-4 md:ml-20">
          <div className="w-full max-w-[800px] flex mt-20 justify-center gap-4">
            {[
                "GFXvs Point Holders",
                "Collectors",
                "Creators",
            ].map((tab) => (
                <button
                key={tab}
                className={`spartan-semibold w-[250px] px-9 py-2.5 
                  rounded-tl-[15px] rounded-tr-[45px] rounded-bl-0 rounded-br-[45px] 
                  border-t-[0.75px] border-r-[0.75px] 
                  text-[13.5px] font-medium leading-[15.12px] tracking-[-0.06em]
                  ${activeTab === tab ? 'border-[#00FF00] text-[#00FF00]' : 'border-[#888888] text-[#FFFFFF]'}
                  bg-transparent relative z-[1]`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
                </button>
            ))}
            </div>
            {activeTab=="Collectors"&&(
              <LeaderboardCollectors/>
            )}
            {activeTab=="GFXvs Point Holders"&&(
              <LeaderboardHolders/>
            )}
            {activeTab=="Creators"&&(
              <LeaderboardCreators/>
            )}
           
          </div>
        </div>
    )
}
export default LeaderBoardPage;