
import { BurnComponent } from "./components/Burn";


const Burn = ()=>{
    return(
        <div className="w-full">
            <BurnComponent tokenIds={["4942"]} contractAddress="artbattle.mintspace2.testnet"/>
        </div>
    )
}
export default Burn;