"use client"
import { useState ,useEffect} from "react";
import { Header } from "@/components/Header/Header";
import "../../components/LeaderBoard/LeaderBoard.css";
import LeaderboardHolders from "@/components/LeaderBoard/LeaderBoardHolders";
import { signIn, useSession } from "next-auth/react";
import { getAuthToken, setAuthToken } from "../../../utils/authToken";
import LeaderboardCollectors from "@/components/LeaderBoard/LeaderBoardCollectors";
import LeaderboardCreators from "@/components/LeaderBoard/LeaderBoardCreators";
import { GFX_CAMPAIGNID } from "@/config/constants";
import InlineSVG from "react-inlinesvg";
import Loader from "@/components/ArtBattle/Loader/Loader";
import { useLeaderBoard } from "@/hooks/leaderboard";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { MobileNav } from "@/components/MobileNav/MobileNav";
const LeaderBoardPage = ()=>{
const [activeTab, setActiveTab] = useState("GFXvs Point Holders");
    const [openNav, setOpenNav] = useState(false);
    const { leaderBoard, totalPage, fetchLeaderBoard } = useLeaderBoard();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const[call,setCall]=useState(false);
    const { data: session, status } = useSession();
    const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
    const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleTabClick = (tab:any)=>{
    setActiveTab(tab);
  }
  
  useEffect(() => {
    fetchInitialData()
}, []);

const fetchInitialData = async () => {
  setCall(true)
  await fetchLeaderBoard(1);
  setCall(false);
};

  
    return(
      <div className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh]" style={{ backgroundPosition: 'top', backgroundSize: 'cover', overflowX: 'hidden', overflowY: 'auto' }}>
      <Header
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor=""
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast} 
        setErrMsg={setErrMsg}
      />
      {/* <InlineSVG src="/icons/blur-effect.svg" className="effect" /> */}
<div
  className="flex spartan-semibold lg:ml-[90px] md:ml-10 sm:ml-5 ml-2 gap-1 items-center px-4 mt-[40px] pt-20"
>
  <button className="camapign-path-button bg-gradient-to-r from-white/10 to-white/15 text-center flex items-center justify-center h-[30.75px] px-[18px] py-[7.5px] rounded-full border-[0.75px] border-[#00ff00]">
    GFXvs
  </button>
  <InlineSVG src="/icons/green-arrow.svg" className="fill-[#00ff00]" />
  <h3
    className="text-[#00ff00] underline cursor-pointer"
    // onClick={handleNavigation}
  >
    Leaderboard
  </h3>
</div>

<div className="flex flex-col gap-1 mr-20 w-full px-4 md:px-[100px] lg:px-[100px] text-center">
  <div
    className="w-full h-[230px] flex mt-5 py-[20px] items-center justify-center rounded-[11.2px] border-[0.75px] border-[#939393] text-white"
    style={{
      background:
        "linear-gradient(90deg, #000000 55%, rgba(0, 0, 0, 0) 100%), url('/images/campaignbg.png') no-repeat right center",
      backgroundSize: "contain",
    }}
  >
    <h1 className="spartan-semibold bg-clip-text text-center text-transparent font-bold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-b from-[#00ff00] to-[#009900]">
      GFXvs Leaderboard
    </h1>
  </div>
</div>
      
      <div className="w-full px-3 sm:px-6 lg:px-20">
  {/* Tabs Section */}
  <div className="w-full max-w-[800px] flex flex-wrap justify-center mt-10 sm:mt-20 gap-2 md:gap-4">
    {[
      "GFXvs Point Holders",
      "Collectors",
      "Creators",
    ].map((tab, index) => (
      <button
        key={tab}
        className={`spartan-semibold w-[150px] sm:w-[200px] lg:w-[250px] px-4 sm:px-6 lg:px-9 py-2 
          rounded-tl-[15px] rounded-tr-[45px] rounded-bl-0 rounded-br-[45px] 
          border-t-[0.75px] border-r-[0.75px] 
          text-[12px] sm:text-[13.5px] font-medium leading-[15px] tracking-[-0.06em]
          ${activeTab === tab ? 'border-[#00FF00] text-[#00FF00]' : 'border-[#888888] text-[#FFFFFF]'}
          bg-transparent relative z-[1] 
          ${index === 2 ? 'self-center sm:ml-0 lg:mt-0 md:mt-0' : ''}`} // Align third button to the left
        onClick={() => handleTabClick(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

        {/* Tab Content */}
        <div className="">
          {/* {call?(
            <> */}
              {activeTab === "Collectors" && <LeaderboardCollectors />}
              {activeTab === "GFXvs Point Holders" && <LeaderboardHolders />}
              {activeTab === "Creators" && <LeaderboardCreators />}
              {/* </>
          ):(
            <>
             <Loader md="21" sm="15" />
            </>
          )} */}
         
        </div>
      </div>
      <FooterMenu fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} setSignToast={setSignToast} setErrMsg={setErrMsg} />
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} fontColor={""} campaignId={GFX_CAMPAIGNID} toggleUploadModal={toggleUploadModal} uploadSuccess={uploadSuccess} setSignToast={setSignToast} setErrMsg={setErrMsg} />
    </div>    
    )
}
export default LeaderBoardPage;