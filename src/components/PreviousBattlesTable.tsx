import React, { useEffect, useState } from "react";
// import { BattleData, useFetchBattles } from '@/hooks/battleHooks';
// import { ArtData, useFetchBattles } from "@/hooks/artHooks";
import{BattleData,useFetchBattles} from '@/hooks/battleHooks'
import Image from "next/image";
import { SPECIAL_WINNER_CONTRACT } from "../config/constants";

const PreviousArtTable: React.FC<{ toggleUploadModal: () => void,campaignId: string,fontColor:string }> = ({
  toggleUploadModal,campaignId,fontColor
}) => {
  const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);
  const { battles, error, loading, fetchMoreBattles } = useFetchBattles();
  const [page, setPage] = useState(1);
  const [hasnext, setHasNext] = useState(false);
  const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
  const [pop, setPopUp] = useState(false);
  const [sort, setSort] = useState("date");
  useEffect(() => {
    if (battles && battles.pastBattles) {
     
      if (page > battles.totalPages - 1) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
     
      console.log(battles.totalPages,page)
      setPreviousBattles(battles.pastBattles);
    }
  }, [battles]);



  useEffect(()=>{
    fetchMoreBattles(campaignId,sort, page);
  },[campaignId,page])

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const formatDate = (timestamp: Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',  
      day: '2-digit',  
      year: 'numeric'  
    });
  };
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortType = event.target.value
    setSort(sortType);
    setPage(1); // Reset to first page when sorting
    fetchMoreBattles(campaignId,sortType, 1);
  };
  
  return (
    <section id="previous">
    <div className="battle-table mt-8  md:ml-8 md:mr-8 lg:ml-20 lg:mr-20 my-12 flex flex-col items-center">
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center" style={{color:fontColor}}>
        Previous Battles
      </h2>
      <p className="battle-table1 w-full overflow-x-auto text-center text-white font-mono mt-5 sm:font-thin md:text-lg" style={{color:fontColor}}>
        <a
          href="https://wallet.mintbase.xyz/"
          target="_blank"
          className="text-green-600"
        >
          Check your wallet
        </a>{" "}
        to see your rewards and the spoils of victory if you were a lucky
        winner. Relive the excitement and see which masterpieces emerged
        victorious!
      </p>
      <div className=" pb-10 w-full overflow-x-auto">
        <div className="flex items-center justify-between">
          <div className="px-5 w-full">
            <table className="min-w-full mt-4 overflow-hidden ">
              <thead>
                <tr className="text-xs md:text-2xl sm:text-xl">
                  <th
                    className="text-center  font-normal text-white"
                    style={{
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  >
                    UNIQUE RARE
                  </th>
                  <th className="text-center  font-normal text-white">
                    RARE OWNER
                  </th>
                  <th
                  
                    className="text-white text-center cursor-pointer font-normal hover:underline"
                  >
                    <span className="flex items-center justify-center ">
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        className="ml-1"
                      >
                        <g fill="none">
                          <path
                            fill="currentColor"
                            d="M2 9c0-1.886 0-2.828.586-3.414C3.172 5 4.114 5 6 5h12c1.886 0 2.828 0 3.414.586C22 6.172 22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9m0 9c0 1.886 0 2.828.586 3.414C3.172 22 4.114 22 6 22h12c1.886 0 2.828 0 3.414-.586C22 20.828 22 19.886 22 18v-5c0-.471 0-.707-.146-.854C21.707 12 21.47 12 21 12H3c-.471 0-.707 0-.854.146C2 12.293 2 12.53 2 13z"
                          />
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="M7 3v3m10-3v3"
                          />
                        </g>
                      </svg>
                      DATE */}
                           <select
                                 onChange={handleSort}
                            className="bg-white lg:ml-10 md:ml-10 text-black border border-gray-600 rounded-lg cursor-pointer"
                          >
                              <option value="dateDsc">Date DSC</option>
                              <option value="dateAsc">Date ASC</option>
                               <option value="voteDsc">Vote DSC</option>
                               <option value="voteAsc">Vote ASC</option>
                          </select>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-96">
                {previousBattles.map((battle, index) => (
                  <>
                    <br />
                    <tr
                      key={index}
                      className="bg-white overflow-y-auto max-h-96"
                      style={{
                        borderTopLeftRadius: 40,
                        borderBottomLeftRadius: 40,
                      }}
                    >
                      <td
                        className="p-0 w-24 h-24 sm:w-36 sm:h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
                        style={{
                          borderTopLeftRadius: 40,
                          borderBottomLeftRadius: 40,
                        }}
                      >
                        <div
                          className="bg-white h-full w-full"
                          style={{ borderRadius: 40 }}
                        >
                          <a
                            href={`https://www.tradeport.xyz/near/collection/${SPECIAL_WINNER_CONTRACT}?bottomTab=trades&tab=items&tokenId=${battle.tokenId}`}
                            target="_blank"
                            className="flex flex-col items-center h-full w-full"
                          >
                            <div
                              className="relative w-full h-full"
                              style={{
                                borderTopLeftRadius: 40,
                                borderBottomLeftRadius: 40,
                              }}
                            >
                              <Image
                                src={battle.grayScale?(
                                  battle.grayScale
                                ):(
                                  battle.winningArt=='Art A'?battle.artAcolouredArt as string:battle.artBcolouredArt
                                )}
                                alt={"Art"}
                                width={400} // Arbitrary value; the actual size will be controlled by CSS
                                height={400} // Arbitrary value; the actual size will be controlled by CSS
                                className="w-full h-full border object-cover rounded-l-3xl "
                                unoptimized
                                style={{
                                  height: "100%", // Ensuring the image takes the full height of its container
                                  aspectRatio: "1/1",
                                  boxShadow:
                                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                }}
                              />
                              <div className="absolute bottom-0 left-0 w-full p-4 text-center text-white gradient-shadow  bg-opacity-50">
                                <p className="text-[5px] break-all md:text-xl sm:text-xs font-medium">
                                {battle.winningArt=='Art A'?(
                                  <>
                                      {battle.artAtitle.length > 10
                                        ? `${battle.artAtitle.substring(0, 10)}...`
                                        : battle.artAtitle}{" "}
                                      by {battle.artAartistId}
                                      </>
                                ):(
                                  <>
                                        {battle.artBtitle.length > 10
                                        ? `${battle.artBtitle.substring(0, 10)}...`
                                        : battle.artBtitle}{" "}
                                      by {battle.artBartistId}
                                      </>
                                )}
                                </p>
                              </div>
                            </div>
                          </a>
                        </div>
                      </td>

                      <td className="px-4 py-2 text-xs sm:text-2xl font-medium break-words break-all text-black text-center special-winner">
                        {battle.specialWinner == null
                          ? (
                            <>
                            {Number(battle.artAVotes)+Number(battle.artBVotes)!=0?(
                              <>
                              {battle.winningArt=='Art A'?(
                                <>
                                {battle.artAspecialWinner}
                                </>
                              ):(
                                <>
                                 {battle.artBspecialWinner}
                                </>
                              )}
                              </>
                            ):(
                              <>
                             Insufficient Votes
                              </>
                            )}
                            </>
                          )
                          :(
                            <>
                            {battle.specialWinner}
                            </>
                          )}
                        <br />
                      </td>
                      <td
                        className="px-4 py-2 text-xs  sm:text-2xl font-medium break-words  break-all text-black text-center special-winner"
                        style={{
                          borderTopRightRadius: 20,
                          borderBottomRightRadius: 20,
                        }}
                      >
                        {battle.startTime
                          ? formatDate(battle.startTime)
                          : "Date not available"}
                          <br></br>
                             {Number(battle.artAVotes) + Number(battle.artBVotes)} votes
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <nav className="flex justify-center flex-wrap gap-5 mt-6">
          <a
            href={page > 1 ? "#previous" : undefined}
            className={`shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              page <= 1
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </a>
          <a
          href={hasnext ? undefined : "#previous"}
            className={` shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              hasnext
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={hasnext ? undefined : handleNext}
          >
            Next
          </a>
        </nav>
      </div>
    </div>
    </section>
  );
};

export default PreviousArtTable;