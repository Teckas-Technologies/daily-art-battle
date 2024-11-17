import React from "react";
import InlineSVG from "react-inlinesvg";
interface WalletHistoryProps {
  rendered: boolean;
}
const WalletHistory: React.FC<WalletHistoryProps> = ({ rendered }) => {
  const transactions = [
    { id: 1, type: "Paid to Art Battles", date: "12 Oct 2024", amount: -100 },
    { id: 2, type: "Paid to Art Battles", date: "12 Oct 2024", amount: -100 },
    { id: 3, type: "Paid to Art Battles", date: "12 Oct 2024", amount: -100 },
    { id: 4, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
    { id: 5, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
    { id: 6, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
    { id: 7, type: "Rewards from NFT", date: "12 Oct 2024", amount: 100 },
  ];
  return (
    <div className="bg-transparent min-h-screen text-white mt-[50px]">
      <h1 className="text-[#00FF00] text-base font-semibold mb-6">
        Wallet Transaction History
      </h1>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center bg-transparent px-[20px] py-[13px] md:px-[60px] md:py-[12px] rounded-lg"
            style={{ border: "0.75px solid gray" }}
          >
            <div className="flex items-center space-x-2">
              <InlineSVG
                src="/icons/transaction.svg"
                className="md:w-6 md:h-6 w-4 h-4"
              />
              <span className="md:text-[12px] text-[10px]">{transaction.type}</span>
            </div>
            <div className="flex items-center space-x-2 md:text-[12px] text-[10px]">
              <span>on {transaction.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              {transaction.amount > 0 ? (
                <InlineSVG
                  src="/icons/red-uparrow.svg"
                  className="text-green-500"
                />
              ) : (
                <InlineSVG
                  src="/icons/green-downarrow.svg"
                  className="text-red-500"
                />
              )}
              <InlineSVG src="/icons/coin.svg" />
              <span
                className={`md:text-[12px] text-[10px] font-semibold ${
                  transaction.amount > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {transaction.amount > 0
                  ? `+${transaction.amount}`
                  : `${transaction.amount}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletHistory;
