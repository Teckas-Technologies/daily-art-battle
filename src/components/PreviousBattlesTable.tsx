import React, { useEffect, useState } from 'react';
import { BattleData, useFetchBattles } from '@/hooks/battleHooks';
import { useMbWallet } from "@mintbase-js/react";
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const PreviousArtTable: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
    const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);
    const { battles, error, loading,fetchMoreBattles,fetchBattlesbyVotes} = useFetchBattles();
    const { isConnected, selector, connect, activeAccountId } = useMbWallet();
    const [page, setPage] = useState(1);
    const [hasnext,setHasNext] = useState(false);
    const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
    const [pop, setPopUp] = useState(false);



    useEffect(() => {
        if (battles && battles.pastBattles) {
            if (battles.pastBattles.length < 10) { 
                setHasNext(true);
              }else{
                setHasNext(false);
              }
            setPreviousBattles(battles.pastBattles);
        }
    }, [battles]);

    const handleNext = () => {
        setPage(prevPage => prevPage + 1);
        fetchMoreBattles(page + 1);
      };
    
      const handlePrevious = () => {
        if (page > 1) {
          setPage(prevPage => prevPage - 1);
          fetchMoreBattles(page - 1);
        }
      };


  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  const handlePopUp = (artId: string) => {
    setSelectedArtId(artId); // Set the ID of the art for which the popup should be shown
    setPopUp(true);
};

const closePopUp = () => {
    setSelectedArtId(null); // Reset the selected art ID to close the popup
    setPopUp(false);
};
    return (
        <div className="battle-table mt-8 pb-10 flex flex-col items-center w-full">
            <h2 className="text-xl font-bold text-black text-center">Previous Battles</h2>
            <p  className='battle-table1 pb-10 w-full overflow-x-auto text-center text-black font-mono mt-5 sm:font-thin md:text-lg'><a href='https://wallet.mintbase.xyz/' className='text-green-600'>Check your wallet</a> to see your rewards and the spoils of victory if you were a lucky winner. Relive the excitement and see which masterpieces emerged victorious!
</p>
           <div className="battle-table1 pb-10 w-full overflow-x-auto">
       
         
                <div className="flex items-center justify-between w-full">
                    <Table className="min-w-full mt-4">
                        <TableHeader>
                            <TableRow className="bg-white">
                                <TableHead  className="px-2 sm:px-6 py-3  text-xs sm:text-sm text-center" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Unique Rare</TableHead >
                                <TableHead  className="px-2 sm:px-6 py-3  text-xs sm:text-sm text-center" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5,borderRight: '1px solid black', color: 'black' }}>Rare Owner</TableHead >
                                <TableHead  className="px-2 sm:px-6 py-3  text-xs sm:text-sm text-center" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5,borderRight: '1px solid black', color: 'black' }}>Votes</TableHead >
                                <TableHead  className="px-2 sm:px-6 py-3  text-xs sm:text-sm text-center" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, color: 'black' }}>Date</TableHead >
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {previousBattles.map((battle, index) => (
                              <>
                                <TableRow key={index} className="border-b bg-white">
                                    <TableCell className="px-2 sm:px-6 py-4  text-xs sm:text-sm font-medium" style={{ color: 'black' }}>
                                        <div className="flex justify-center px-2 sm:px-6 py-2 text-xs sm:text-sm font-medium">
                                      <div className=" md:shrink-0">
                                            <Image
                                             src={battle.winningArt === 'Art A' ? battle.artAcolouredArt : battle.artBcolouredArt}
                                             alt={battle.winningArt === 'Art A' ? "Art A" : "Art B"}
                                                width={100} 
                                                height={100} 
                                                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 md:shrink-0 custom-img-size"
                                                unoptimized
                                            />
                                            </div>
                                        </div>
                                        <p className="mt-2 py-2 text-xs sm:text-sm font-small break-all text-center">{battle.winningArt === 'Art A' ? `${battle.artAtitle} by ${battle.artAartistId} `: `${battle.artBtitle} by ${battle.artBartistId} `}</p>
                                        </TableCell>
                               
                                    <TableCell className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner break-all">
                                    {battle.winningArt === "Art A" ? battle.artAspecialWinner : battle.artBspecialWinner}
                                    <br></br>
                                    </TableCell>
                                    <TableCell className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner">
                                    {battle.winningArt === "Art A" ?`${battle.artAVotes}` : `${battle.artBVotes}`}
                                    </TableCell>
                                    <TableCell className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner">
                                    {`${formatDate(battle.startTime)}`}
                                    </TableCell>
                                </TableRow>
                                <TableRow key={index} className="border-b bg-white">
                                    <TableCell  className="px-2 sm:px-6 py-4  text-xs sm:text-sm font-medium" style={{ color: 'black' }}>
                                        <div className="flex justify-center px-2 sm:px-6 py-2 text-xs sm:text-sm font-medium">
                                      <div className=" md:shrink-0">
                                            <Image
                                             src={battle.winningArt === 'Art A' ? battle.artBcolouredArt : battle.artAcolouredArt}
                                             alt={battle.winningArt === 'Art A' ? "Art B" : "Art A"}
                                                width={100} 
                                                height={100} 
                                                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 md:shrink-0 custom-img-size"
                                                unoptimized
                                            />
                                            </div>
                                        </div>
                                        <p className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-center">{battle.winningArt === 'Art B' ? `${battle.artAtitle} by ${battle.artAartistId} `: `${battle.artBtitle} by ${battle.artBartistId} `}</p>
                                    </TableCell >
                                
                                    <TableCell  className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner break-all">
                                    {battle.winningArt === "Art B" ? battle.artAspecialWinner : battle.artBspecialWinner}
                                    <br></br>

                                   

                                       </TableCell >
                                   
                                    <TableCell  className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner">
                                    {battle.winningArt === "Art B" ?`${battle.artAVotes}` : `${battle.artBVotes}`}
                                   
                                    </TableCell >
                                    <TableCell  className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner">
                                    {`${formatDate(battle.startTime)}`}
                                    </TableCell >
                                </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>

                </div>
                <nav className="flex justify-center flex-wrap gap-4 mt-2">
          <a
            className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${page <= 1 ? 'cursor-not-allowed' : 'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </a>
          <a
            className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${hasnext?'cursor-not-allowed' :'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
            onClick={hasnext ? undefined : handleNext}
          >
            Next
          </a>
        </nav>
            </div>
        </div>
    );
    
    
}

export default PreviousArtTable;