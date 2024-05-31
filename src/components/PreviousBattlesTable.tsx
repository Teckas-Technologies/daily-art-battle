import React, { useEffect, useState } from 'react';
import { BattleData, useFetchBattles } from '@/hooks/battleHooks';
import { useMbWallet } from "@mintbase-js/react";
import Image from 'next/image';

const PreviousArtTable: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
    const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);
    const { battles, error, loading } = useFetchBattles();
    const { isConnected, selector, connect, activeAccountId } = useMbWallet();

    console.log("Fetched battles from hook:", battles);

    useEffect(() => {
        if (battles && battles.pastBattles) {
            console.log("Setting previous battles:", battles.pastBattles);
            setPreviousBattles(battles.pastBattles);
        }
    }, [battles]);

    console.log("Previous Battles in state:", previousBattles);

    return (
        <div className="battle-table mt-8 pb-10 flex flex-col items-center w-full">
            <h2 className="text-xl font-bold text-black text-center">Previous Battles</h2>
            <div className="battle-table1 pb-10 w-full overflow-x-auto">
                <div className="flex items-center justify-between w-full">
                    <table className="min-w-full mt-4">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Art A</th>
                                <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderRight: '1px solid black', color: 'black' }}>Art B</th>
                                <th className="px-2 sm:px-6 py-3 text-xs sm:text-sm text-left" style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, color: 'black' }}>Special Winner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previousBattles.map((battle, index) => (
                                <tr key={index} className="border-b bg-white">
                                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium" style={{ color: 'black' }}>
                                        <div className="flex justify-center">
                                            <Image
                                                src={battle.artAgrayScale}
                                                alt="Art A"
                                                width={100} 
                                                height={100} 
                                                className="sm:w-48 sm:h-48 w-36 h-36"
                                                unoptimized
                                            />
                                        </div>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4  text-xs sm:text-sm font-medium" style={{ color: 'black' }}>
                                        <div className="flex justify-center">
                                            <Image
                                                src={battle.artBgrayScale}
                                                alt="Art B"
                                                width={100} 
                                                height={100}
                                                className="sm:w-48 sm:h-48 w-36 h-36"
                                                unoptimized
                                            />
                                        </div>
                                    </td>
                                    <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm" style={{ color: 'black' }}>
                                        {battle.specialWinner}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
            </div>
        </div>
    );
    
    
}

export default PreviousArtTable;
