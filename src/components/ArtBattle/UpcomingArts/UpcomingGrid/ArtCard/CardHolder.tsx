// CardHolder.tsx
import React, { useContext, useEffect, useState } from 'react';
import { ArtData, useFetchArtById } from '@/hooks/artHooks';
import { useArtsRaffleCount } from '@/hooks/useRaffleTickets';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import './Card.css';
import Card from './Card';
import Toast from '@/components/Toast';
import { BuyRafflePopup } from '@/components/ArtBattle/RafflePopup/BuyRafflePopup';
import InlineSVG from 'react-inlinesvg';
import { SignInPopup } from '@/components/PopUps/SignInPopup';
import { NearContext } from '@/wallet/WalletSelector';

interface CardHolderProps {
    artData: ArtData[];
    campaignId: string;
    adminEmail: string;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedArt: (e: any) => void;
    totalPage: number;
    removeArtById: (id: string) => void;
}

const CardHolder: React.FC<CardHolderProps> = ({ artData, campaignId, adminEmail, setRefresh, setSelectedArt, totalPage, removeArtById }) => {
    const { wallet, signedAccountId } = useContext(NearContext);
    const { fetchArtUserRaffleCount } = useArtsRaffleCount();
    const [success, setSuccess] = useState(false);
    const [myTickets, setMyTickets] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { fetchArtById } = useFetchArtById();
    const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
    const [overlayArt, setoverlayArt] = useState<ArtData | null>(null);
    const [myTicketsNew, setMyTicketsNew] = useState<{ [key: string]: number }>({});
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [signToast, setSignToast] = useState(false);
    const [artId, setArtId] = useState("");

    useEffect(() => {
        if (err) {
            setTimeout(() => setErr(false), 3000);
        }
    }, [err])

    useEffect(() => {
        const artid = searchParams?.get('artId');
        if (artid) {
            setArtId(artid);
        }
    }, [searchParams, pathName]); 


    const getQueryParam = (param: string): string | null => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            return url.searchParams.get(param);
        }
        return null;
    };
    // const artId = getQueryParam('artId');

    useEffect(() => {
        const fetchArt = async () => {
            if (artId) {
                const overlay = await fetchArtById(artId);
                setSelectedArtId(artId)
                setoverlayArt(overlay);
            }
        }
        fetchArt();
    }, [artId, success]);

    const handleImageClick = async (id: any) => {
        setSelectedArtId(id);
        setSuccess(false);
        const overlay = await fetchArtById(id);
        setoverlayArt(overlay);
        setSelectedArt(overlayArt); // For pass the selected art to upcoming grid component
        const url = new URL(window.location.href);
        url.searchParams.set('artId', id);
        window.history.pushState({}, '', url.toString());
    };

    useEffect(() => {
        const fetchAllTickets = async () => {
            const ticketsMap: { [key: string]: number } = {};
            await Promise.all(
                artData.map(async (art) => {
                    const tickets = await fetchArtUserRaffleCount(art._id as string, campaignId);
                    ticketsMap[art._id] = tickets;
                })
            );
            setMyTicketsNew(ticketsMap);
        };

        if (artData.length > 0) {
            // fetchAllTickets();
            const timer = setTimeout(() => {
                fetchAllTickets();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [artData, campaignId, success]);

    const fetchArtUserticketss = async (art: ArtData) => {
        if (art) {
            const tickets = await fetchArtUserRaffleCount(art?._id as string, campaignId);
            setMyTickets(tickets);
        }
    };

    useEffect(() => {
        if (overlayArt) {
            fetchArtUserticketss(overlayArt);
        }
    }, [signedAccountId, fetchArtUserRaffleCount, overlayArt, success]);

    return (
        <>
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-[1.5rem] lg:gap-[1.5rem] md:gap-[1rem] gap-[0.5rem]" id="upcoming-grid">
                {artData.map((art, index) => (
                    <div key={index}>
                        <Card art={art} myTicketsNew={myTicketsNew[art._id] || 0} onImageClick={handleImageClick} removeArtById={removeArtById} campaignId={campaignId} success={success} overlayArt={overlayArt} adminEmail={adminEmail} />
                    </div>
                ))}
            </div>
            {selectedArtId && overlayArt && !signToast && <BuyRafflePopup overlayArt={overlayArt} setRefresh={setRefresh} campaignId={campaignId} setSuccess={setSuccess} myTickets={myTickets} setSelectedArtId={setSelectedArtId} setErr={setErr} setErrMsg={setErrMsg} setSignToast={setSignToast} />}

            {signToast && <SignInPopup text="Sign In to Collect a Raffle Ticket!" onClose={() => setSignToast(false)} />}

            {success && <Toast
                success={true}
                message={"Raffle Tickets Collected!"}
                onClose={() => setSuccess(false)}
            />}
            {/* {err && <Toast
                success={false}
                message={errMsg}
                onClose={() => setErr(false)}
            />} */}
        </>

    );
};

export default CardHolder;