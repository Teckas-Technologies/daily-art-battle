import { NearWalletConnector } from "@/components/NearWalletConnector";
import Prof from "./components/ProfileSection";
import NftGrid from "./components/Nfts";
import Profile2 from "./components/Test";

const Home = ()=>{
    return(
        <div className="w-full">
            <NearWalletConnector/>
            <Prof/>
          {/* <Profile2/> */}
        </div>
    )
}
export default Home;