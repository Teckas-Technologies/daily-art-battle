import { useContext, useEffect, useState } from "react";
import "./BuyCoins.css";
import InlineSVG from "react-inlinesvg";
import useFetchBuyCoin from "@/hooks/BuyCoinhook";
import estFetchAmount from "@/hooks/EstHook";
import useNEARTransfer from "@/hooks/useTransfer";
import { NearContext } from "@/wallet/WalletSelector";
import Loader from "@/components/ArtBattle/Loader/Loader";
import { useAuth } from "@/contexts/AuthContext";
interface CoinPurchasePopupProps {
  onClose: () => void;
}
interface CoinMap {
  [key: string]: number;
}

interface FetchBuyCoinData {
  gfxCoinMap: CoinMap;
}
const CoinPurchasePopup: React.FC<CoinPurchasePopupProps> = ({ onClose }) => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);
  const [isTransactionFailed, setIsTransactionFailed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSelectedCoin, setDropdownSelectedCoin] = useState<
    string | null
  >("USDT");
  const { user } = useAuth();
  let userDetails = user;
  const { transfer, error, Usdttransfer } = useNEARTransfer();
  const numericCustomValue = customValue ? parseFloat(customValue) : 0;
  const { data, loading } = useFetchBuyCoin(
    dropdownSelectedCoin === "USDT" ? "usdc" : "near"
  ) as {
    data: FetchBuyCoinData | null;
    loading: boolean;
    error: string | null;
  };
  const { amount, fetchBuyCoinAmount } = estFetchAmount(
    dropdownSelectedCoin === "USDT" ? "usdc" : "near",
    numericCustomValue
  );
  const { wallet, signedAccountId } = useContext(NearContext);
  useEffect(() => {
    if (numericCustomValue > 0) {
      fetchBuyCoinAmount();
    }
  }, [customValue, dropdownSelectedCoin]);
  useEffect(() => {
    setCustomValue("");
    setSelectedCoin("");
  }, [dropdownSelectedCoin]);
  const buttonText =
    numericCustomValue > 0 && amount
      ? dropdownSelectedCoin === "USDT"
        ? `${amount.totalUsdc || 0} USDT`
        : `${amount.totalNear || 0} NEAR`
      : `Est ${dropdownSelectedCoin}`;
  const handleCoinSelect = (value: string) => {
    const numericValue = value.split(" ")[0];
    setSelectedCoin(numericValue);
    setCustomValue("");
    console.log("Selected Coin:", numericValue);
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value);
    setSelectedCoin(null);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownSelect = (value: string) => {
    setDropdownSelectedCoin(value);
    setIsDropdownOpen(false);
  };
  const coinOptions = data
    ? Object.entries(data.gfxCoinMap).map(([key, value]) => ({
        gfx: `${value} GFX`,
        near: `${key} ${dropdownSelectedCoin}`,
      }))
    : [];
  const handleTransfer = async () => {
    if (!selectedCoin && !amount) {
      console.error("No coin selected or amount calculated for transfer.");
      return;
    }

    const coinValue =
      selectedCoin || (amount?.totalNear || amount?.totalUsdc)?.toString();
    console.log(">>>", amount?.totalNear);

    if (!coinValue) {
      console.error("Invalid coin value.");
      return;
    }
    if (dropdownSelectedCoin === "USDT") {
      const result = await Usdttransfer(coinValue);
      if (result?.success) {
        console.log("USDT Transfer successful:", result);
      } else {
        console.error("USDT Transfer failed:", result?.error);
      }
    } else {
      const result = await transfer(coinValue);
      if (result?.success) {
        console.log("NEAR Transfer successful:", result);
      } else {
        console.error("NEAR Transfer failed:", result?.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="scroll-container bg-[#000000] text-white w-[90%] px-[20px] py-[20px] md:w-[500px] md:h-[500px] md:px-[30px] md:py-[20px] rounded-2xl shadow-xl relative"
        style={{ border: "1px solid #8B8B8B" }}
      >
        <button className="absolute top-4 right-4 text-green-500 text-xl">
          <InlineSVG src="/icons/x.svg" className="w-6 h-6" onClick={onClose} />
        </button>

        <h2 className="text-center text-[#00FF00] font-semibold mb-8 mt-6">
          Purchase Coins
        </h2>

        <>
          <div
            className="flex items-center justify-between bg-[#000000] p-3 rounded-md mb-6 shadow-md cursor-pointer"
            style={{ border: "1px solid #3E3E3E" }}
            onClick={handleDropdownToggle}
          >
            <span className="flex items-center gap-2 text-white">
              <InlineSVG
                src={
                  dropdownSelectedCoin === "USDT"
                    ? "/icons/T.svg"
                    : "/icons/NEAR.svg"
                }
                className="w-8 h-8"
              />
              {dropdownSelectedCoin || "USDT"}
            </span>
            <InlineSVG
              src="/icons/dropdown-icon.svg"
              className={`transform transition-transform duration-300 ease-in-out ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isDropdownOpen && (
            <div className="bg-[#171717] p-2 rounded-md mb-6 shadow-md">
              <div
                className="cursor-pointer p-2 hover:bg-[#333333] rounded"
                onClick={() => handleDropdownSelect("USDT")}
              >
                USDT
              </div>
              <div
                className="cursor-pointer p-2 hover:bg-[#333333] rounded"
                onClick={() => handleDropdownSelect("NEAR")}
              >
                NEAR
              </div>
            </div>
          )}
          {loading ? (
            <div className="fles items-center justify-center">
              <Loader md="20" sm="15" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 md:mb-4 mb-6">
              {coinOptions.map((coin, index) => {
                const numericValue = coin.near.split(" ")[0];
                return (
                  <div className="coins-div" key={index}>
                    <div
                      className={`flex flex-col items-center p-2 sm:p-3 rounded-lg cursor-pointer bg-[#171717] ${
                        selectedCoin === numericValue
                          ? "border border-[#00FF00]"
                          : ""
                      }`}
                      onClick={() => handleCoinSelect(coin.near)}
                    >
                      <img
                        src="/icons/coin.svg"
                        alt="Coin Icon"
                        className="md:w-8 w-7 md:h-8 h-7 mb-2"
                      />
                      <p className="text-[7px] md:text-sm">{coin.gfx}</p>
                      <button className="coin-btn text-[#FFFFFF] rounded-full text-[8px] md:px-4 px-2 md:py-2 py-[5px] mt-1 md:text-xs w-full">
                        {coin.near}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center text-gray-500 mb-4 flex flex-row items-center justify-center gap-5">
            <InlineSVG src="/icons/OR-leftLine.svg" />
            <p>or</p>
            <InlineSVG src="/icons/OR-rightLine.svg" />
          </div>

          <div className="flex items-center justify-center bg-[#FFFFFF] rounded-full mb-6 px-[8px] py-[5px] md:px-[10px] md:py-[7px]">
            <img
              src="/icons/coin.svg"
              alt="Coin Icon"
              className="w-[20px] h-[20px] ml-3 md:w-8 md:h-8 md:ml-7"
            />
            <input
              type="text"
              placeholder="Enter a Value"
              value={customValue}
              onChange={handleCustomValueChange}
              className="bg-transparent text-black flex-grow outline-none px-2 text-xs placeholder:text-xs md:text-sm md:px-4"
            />
            <button className="text-white bg-[#00FF00] rounded-full px-4 py-2 text-xs md:text-sm md:px-8 md:py-4 md:ml-3">
              {buttonText}
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-[40px] mb-[50px]">
            <button
              className="py-2 px-3 text-[10px] border border-[#00FF00] rounded-full text-[#FFFFFF] md:py-3 md:px-6 md:text-xs"
              onClick={onClose}
            >
              Cancel Purchase
            </button>
            <button
              className={`py-2 px-3 text-[10px] text-[#FFFFFF] rounded-full md:py-3 md:px-6 md:text-xs ${
                selectedCoin || customValue
                  ? "active-btn"
                  : "bg-[#AAAAAA] text-[#FFFFFF] cursor-not-allowed"
              }`}
              disabled={!selectedCoin && !customValue}
              onClick={handleTransfer}
            >
              Continue Purchase
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default CoinPurchasePopup;
