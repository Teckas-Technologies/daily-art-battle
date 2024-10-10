"use client";
import { useTodayBattleSpinner } from '@/hooks/useTodayBattleSpinner';
import './Spinner.css';
import { useEffect, useState } from 'react';

interface Response {
    spinnerUrl: string;
    metadata: string;
    emoji1: string;
    emoji2: string;
    battleId: string;
}

export const Spinner: React.FC = () => {
    const { fetchTodayBattleSpinner } = useTodayBattleSpinner();
    const [spinner, setSpinner] = useState<Response | null>();
    useEffect(() => {
        const fetchSpinner = async () => {
            const data = await fetchTodayBattleSpinner();
            setSpinner(data);
        }
        fetchSpinner();
    }, [])
    return (
        <>
            {/* Spinner battle starts */}
            <div className="flex w-full justify-center mt-5">
                <div className="spinner-img relative w-full md:max-w-[26.5rem] max-w-[17rem] rounded-2xl aspect-square m-auto overflow-hidden select-none">
                    <img
                        alt="spinner"
                        draggable={false}
                        src={spinner?.spinnerUrl}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>

            </div>
        </>
    )
}