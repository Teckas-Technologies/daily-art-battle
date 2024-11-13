import { useState } from "react";
import './BuyCoins.css'
interface CoinPurchasePopupProps {
    onClose: () => void;
  }
  const CoinPurchasePopup: React.FC<CoinPurchasePopupProps> = ({ onClose }) => {
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
    const [customValue, setCustomValue] = useState("");
    
    const handleCoinSelect = (value: string) => {
      setSelectedCoin(value);
    };
    
    const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomValue(e.target.value);
    };
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="scroll-container bg-[#000000] text-white w-[500px] h-[500px] px-[30px] py-[20px] rounded-lg shadow-xl relative" style={{border: "1px solid #8B8B8B"}}>
        <button className="absolute top-4 right-4 text-green-500 text-xl">
          
        </button>
        
        <h2 className="text-center text-green-500 font-semibold mb-6">
          Purchase Coins
        </h2>
        
        <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md mb-6">
          <span className="flex items-center gap-2">
            <span className="text-green-500">T</span> USDT
          </span>
         
        </div>

        <div className="grid grid-cols-3 gap-5 mb-6 ">
          {[{ gfx: "100 GFX", near: "1 NEAR" }, { gfx: "500 GFX", near: "5 NEAR" }, { gfx: "1100 GFX", near: "10 NEAR" },{ gfx: "1100 GFX", near: "10 NEAR" },{ gfx: "1100 GFX", near: "10 NEAR" },{ gfx: "1100 GFX", near: "10 NEAR" }].map((coin, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-3 rounded-lg cursor-pointer ${
                selectedCoin === coin.near ? "bg-gray-700" : "bg-gray-800"
              }`}
              onClick={() => handleCoinSelect(coin.near)}
            >
              <img src="/coin.png" alt="coin" className="w-10 h-10 mb-2" />
              <p>{coin.gfx}</p>
              <span className="bg-green-500 text-black rounded-full px-2 mt-2">
                {coin.near}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 mb-4">or</div>

        <div className="flex items-center bg-gray-800 p-3 rounded-lg mb-6">
          <img src="/coin.png" alt="coin" className="w-8 h-8 mr-3" />
          <input
            type="number"
            placeholder="Enter a Value"
            value={customValue}
            onChange={handleCustomValueChange}
            className="bg-transparent text-white flex-grow outline-none"
          />
          <span className="bg-green-500 text-black rounded-full px-3 py-1 ml-3">
            Est NEAR
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <button className="w-1/2 py-2 border border-green-500 rounded-full text-green-500">
            Cancel Purchase
          </button>
          <button
            className={`w-1/2 py-2 rounded-full ${
              selectedCoin || customValue
                ? "bg-green-500 text-black"
                : "bg-gray-500 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!selectedCoin && !customValue}
          >
            Continue Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinPurchasePopup;
