import React, { useEffect, useState } from 'react';
import { BattleData, useFetchBattles } from '@/hooks/battleHooks';
import { useMbWallet } from "@mintbase-js/react";
import Image from 'next/image';

const PreviousArtTable: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
    const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);
    const { battles, error, loading, fetchMoreBattles, hasMore } = useFetchBattles(); // Retrieve hasMore flag
    const { isConnected, selector, connect, activeAccountId } = useMbWallet();
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (battles && battles.pastBattles) {
            setPreviousBattles(battles.pastBattles);
        }
    }, [battles]);

    const handleNext = () => {
        if (hasMore) { // Only fetch more battles if there are more available
            setPage(prevPage => prevPage + 1);
            fetchMoreBattles(page + 1);
        }
    };
    
    const handlePrevious = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
            fetchMoreBattles(page - 1);
        }
    };

    return (
        <div className="battle-table mt-8 pb-10 flex flex-col items-center w-full">
            <h2 className="text-xl font-bold text-black text-center">Previous Battles</h2>
            <div className="battle-table1 pb-10 w-full overflow-x-auto">
                <div className="flex items-center justify-between w-full">
                    <table className="min-w-full mt-4">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Unique Rare</th>
                                <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Derivative Editions</th>
                                <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, color: 'black' }}>Holders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previousBattles.map((battle, index) => (
                                <tr key={index} className="border-b bg-white">
                                    <td className="px-2 sm:px-6 py-4  text-xs sm:text-sm font-medium" style={{ color: 'black' }}>
                                        <div className="flex justify-center">
                                            <Image
                                                src={battle.artAcolouredArt}
                                                alt="Art A"
                                                width={100} 
                                                height={100} 
                                                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48"
                                                unoptimized
                                            />
                                        </div>
                                        <p className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-center">{battle.artAtitle} by {battle.artAartistId}</p>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4  text-xs sm:text-sm font-medium" style={{ color: 'black' }}>
                                        <div className="flex justify-center">
                                            <Image
                                                src={battle.artAgrayScale}
                                                alt="Art B"
                                                width={100} 
                                                height={100}
                                                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48"
                                                unoptimized
                                            />
                                        </div>
                                        <p className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-center">{battle.artAtitle} by {battle.artAartistId}</p>
                                    </td>
                                    <td className="mt-2 py-2 text-xs sm:text-sm font-small break-words text-black text-center special-winner">
                                        {battle.specialWinner}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <nav className="flex justify-center flex-wrap gap-4 mt-2">
                    <a
                        className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${page <= 1 ? 'cursor-not-allowed' : 'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
                        onClick={page > 1 ? handlePrevious : undefined}
                    >
                        Previous
                    </a>
                    <a
                        className={`flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${!hasMore ? 'cursor-not-allowed' : 'hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white'}`}
                        onClick={hasMore ? handleNext : undefined}
                    >
                        Next
                    </a>
                </nav>
            </div>
        </div>
    );
};

export default PreviousArtTable;
