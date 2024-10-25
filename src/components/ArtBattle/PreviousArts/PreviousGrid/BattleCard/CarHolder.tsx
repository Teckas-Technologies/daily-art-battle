// CardHolder.tsx
import React from 'react';
import Card from './Card';
import { BattleData } from '@/hooks/battleHooks';
import './Card.css';

interface CardHolderProps {
    battles: BattleData[];
    campaignId: string;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    currentPage: number;
    totalPage: number;
}

const CardHolder: React.FC<CardHolderProps> = ({ battles, campaignId, setRefresh, currentPage, totalPage }) => {

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 lg:gap-[5rem] md:gap-[3rem] gap-[2.5rem]" id="previous-grid">
                {battles.map((battle, index) => (
                    <div key={index}>
                        <Card battle={battle} />
                    </div>
                ))}
            </div>
        </>

    );
};

export default CardHolder;
