import React, { useEffect, useRef } from "react";
import InlineSVG from "react-inlinesvg";
import useFetchTransactions from "@/hooks/WalletHistoryHook";
import Loader from "@/components/ArtBattle/Loader/Loader";

interface WalletHistoryProps {
  rendered: boolean;
}

const WalletHistory: React.FC<WalletHistoryProps> = ({ rendered }) => {
  const {
    transactions,
    loading,
    error,
    totalPages,
    currentPage,
    fetchTransactions,
  } = useFetchTransactions();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchTransactions(currentPage, 20);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      fetchTransactions(currentPage - 1, 20);
    }
    const element = document.getElementById("content-top");
    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchTransactions(currentPage + 1, 20);
    }
    const element = document.getElementById("content-top");
    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  const handlePageClick = (pageNumber: number) => {
    fetchTransactions(pageNumber, 2);
    const element = document.getElementById("content-top");
    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="bg-transparent min-h-screen text-white mt-[50px] ">
      {loading && (
        <div className="flex justify-center items-center">
          <Loader md="22" sm="15" />
        </div>
      )}
      {!loading && transactions && transactions.length > 0 ? (
        <>
          <h1 className="text-[#00FF00] text-base font-semibold mb-6">
            Wallet Transaction History
          </h1>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex justify-between items-center bg-transparent px-[20px] py-[13px] md:px-[60px] md:py-[12px] rounded-lg"
                style={{ border: "0.75px solid gray" }}
              >
                <div className="flex items-center space-x-2">
                  <InlineSVG
                    src="/icons/transaction.svg"
                    className="md:w-6 md:h-6 w-4 h-4"
                  />
                  <span className="md:text-[12px] text-[10px]">
                    {transaction.transactionType === "spent"
                      ? "Paid to Gfx"
                      : "Rewards from Gfx"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 md:text-[12px] text-[10px]">
                  <span>
                    on{" "}
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {transaction.transactionType === "spent" ? (
                    <InlineSVG src="/icons/red-uparrow.svg" />
                  ) : (
                    <InlineSVG src="/icons/green-downarrow.svg" />
                  )}
                  <img
                    src="/icons/coin.svg"
                    alt="Coin Icon"
                    className="w-[15px] h-[15px]"
                  />
                  <span
                    className={`md:text-[12px] text-[10px] font-semibold w-[55px] md:w-[60px] ${
                      transaction.transactionType === "spent"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                    style={{ textAlign: "left" }}
                  >
                    {transaction.transactionType === "spent"
                      ? `-${transaction.gfxCoin.toFixed(2)}`
                      : `+${transaction.gfxCoin.toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <p className="flex items-center justify-center gap-2 mt-[60px] mb-[30px] text-white font-semibold text-lg">
            <InlineSVG
              src="/icons/info.svg"
              className="fill-current text-white font-bold point-c w-4 h-4 cursor-pointer"
            />{" "}
            No transaction History!
          </p>
        )
      )}
      {!loading && transactions && transactions.length > 0 && (
        <div className="pagination-section relative w-full flex justify-center py-5 mb-[90px]">
          <div className="pagination rounded-[7rem]">
            <div className="w-auto flex items-center justify-center md:gap-[2rem] gap-[1rem] px-7 py-3 rounded-[7rem] bg-black">
              <div
                className={`previous flex items-center gap-1 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={currentPage !== 1 ? handlePrevious : undefined}
              >
                <InlineSVG
                  src="/icons/left-arrow.svg"
                  className="w-3 h-3 spartan-light"
                />
                <h2 className="hidden md:block">Previous</h2>
              </div>

              <div className="page-numbers flex items-center justify-center gap-2">
                {renderPageNumbers().map((pageNumber) => (
                  <div
                    key={pageNumber}
                    className={`page md:h-[3rem] md:w-[3rem] h-[2rem] w-[2rem] flex justify-center items-center ${
                      currentPage === pageNumber ? "active" : "cursor-pointer"
                    }`}
                    onClick={() => handlePageClick(pageNumber)}
                  >
                    <h2>{pageNumber}</h2>
                  </div>
                ))}
              </div>

              <div
                className={`next flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={currentPage !== totalPages ? handleNext : undefined}
              >
                <h2 className="hidden md:block">Next</h2>
                <InlineSVG
                  src="/icons/right-arrow.svg"
                  className="w-3 h-3 spartan-light"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletHistory;
