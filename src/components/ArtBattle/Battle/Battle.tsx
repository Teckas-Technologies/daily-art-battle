"use client";
import InlineSVG from "react-inlinesvg";
import { Slider } from "./Slider/Slider";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner/Spinner";
import { BattleData, useFetchTodayBattle } from "@/hooks/battleHooks";
import { useRouter } from "next/navigation";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { NoBattle } from "./NoBattle/NoBattle";
import Toast from "../../Toast";
import "./Battle.css";
import { Split } from "./Split/Split";
import Loader from "../Loader/Loader";
import { ArtData, useFetchArtById } from "@/hooks/artHooks";
import { usePathname } from "next/navigation";
import { BuyRafflePopup } from "../RafflePopup/BuyRafflePopup";
import { SignInPopup } from "@/components/PopUps/SignInPopup";
import { useArtsRaffleCount } from "@/hooks/useRaffleTickets";

export interface Artwork {
  id: string;
  imageUrl: string;
  name: string;
  title: string;
  artistId: string;
  artistName: string;
}

interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: String;
  loading: boolean;
  error: string | null;
  todayBattle: BattleData | null;
}

const initialViewTools = [
  { id: "split", path: "/icons/split.svg", active: true },
  { id: "slide", path: "/icons/slider.svg", active: false },
  { id: "spinner", path: "/icons/spinner.svg", active: false },
];

export const Battle: React.FC<Props> = ({
  toggleUploadModal,
  campaignId,
  fontColor,
  welcomeText,
  themeTitle,
  loading,
  error,
  todayBattle
}) => {
  // const { todayBattle, loading, battle, error, fetchTodayBattle } = useFetchTodayBattle();
  const router = useRouter();

  const [artA, setArtA] = useState<Artwork>({
    id: "",
    name: "Art A",
    imageUrl: "",
    title: "",
    artistId: "",
    artistName: ""
  });
  const [artB, setArtB] = useState<Artwork>({
    id: "",
    name: "Art B",
    imageUrl: "",
    title: "",
    artistId: "",
    artistName: ""
  });

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [battleId, setBattleId] = useState<string>();
  const [refresh, setRefresh] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewTools, setViewTools] = useState(initialViewTools);
  const [spinnerUrl, setSpinnerUrl] = useState<string>();
  const { fetchArtById } = useFetchArtById();
  const [artARaffleTickets, setArtARaffleTickets] = useState(0);
  const [artBRaffleTickets, setArtBRaffleTickets] = useState(0);
  const [openArtA, setOpenArtA] = useState(false);
  const [openArtB, setOpenArtB] = useState(false);
  const pathName = usePathname();

  const { fetchArtUserRaffleCount } = useArtsRaffleCount();
  const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
  const [overlayArt, setoverlayArt] = useState<ArtData | null>(null);
  const [success, setSuccess] = useState(false);
  const [artAMyTickets, setArtAMyTickets] = useState<number>(0);
  const [artBMyTickets, setArtBMyTickets] = useState<number>(0);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [signToast, setSignToast] = useState(false);

  useEffect(() => {
    if (err) {
      setTimeout(() => setErr(false), 3000);
    }
  }, [err])

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(false), 3000);
    }
  }, [success])

  useEffect(() => {
    if (artA && campaignId) {
      const fetchArtAUsertickets = async () => {
        const tickets = await fetchArtUserRaffleCount(artA?.id as string, campaignId);
        if (tickets !== undefined && tickets !== null) {
          setArtAMyTickets(tickets);
        }
      };
      fetchArtAUsertickets();
    }

    if (artB && campaignId) {
      const fetchArtBUsertickets = async () => {
        const tickets = await fetchArtUserRaffleCount(artB?.id as string, campaignId);
        if (tickets !== undefined && tickets !== null) {
          setArtBMyTickets(tickets);
        }
      };
      fetchArtBUsertickets();
    }

  }, [artA, artB, overlayArt, selectedArtId, success])

  const handleImageClick = async (id: any) => {
    setSelectedArtId(id);
    setSuccess(false);
    console.log(id)
    const overlay = await fetchArtById(id);
    setoverlayArt(overlay);
    const url = new URL(window.location.href);
    url.searchParams.set('artId', id);
    window.history.pushState({}, '', url.toString());
  };

  useEffect(() => {
    if (openArtA) {
      handleImageClick(artA?.id);
    }

    if (openArtB) {
      handleImageClick(artB?.id);
    }

    if (!selectedArtId) {
      setOpenArtA(false);
      setOpenArtB(false);
    }

  }, [openArtA, openArtB, selectedArtId])


  // useEffect(() => {
  //   console.log(campaignId);

  //   const fetchBattle = async () => {
  //     await fetchTodayBattle(campaignId);
  //   };

  //   const timeoutId = setTimeout(() => {
  //     fetchBattle();
  //   }, 100); // 10 seconds in milliseconds

  //   // Cleanup function to clear the timeout if the component unmounts or campaignId changes
  //   return () => clearTimeout(timeoutId);
  // }, [campaignId]);  // moved =======

  useEffect(() => {
    if (todayBattle) {
      const endTime = new Date(todayBattle.endTime).getTime();
      const now = new Date().getTime();
      const remaining = endTime - now;
      setTimeRemaining(remaining > 0 ? remaining : null);

      const timer = setInterval(() => {
        const remainingTime = endTime - new Date().getTime();
        setTimeRemaining(remainingTime > 0 ? remainingTime : null);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [todayBattle]);

  useEffect(() => {
    if (todayBattle) {
      setArtA({
        id: todayBattle?.artAId,
        name: "Art A",
        imageUrl: todayBattle.artAcolouredArt,
        title: todayBattle.artAtitle,
        artistId: todayBattle.artAartistId,
        artistName: todayBattle.artAartistName
      });
      setArtB({
        id: todayBattle?.artBId,
        name: "Art B",
        imageUrl: todayBattle.artBcolouredArt,
        title: todayBattle.artBtitle,
        artistId: todayBattle.artBartistId,
        artistName: todayBattle.artBartistName
      });
      setBattleId(todayBattle._id);
      setSpinnerUrl(todayBattle.grayScale);
    }
  }, [todayBattle]);

  useEffect(() => {
    if (artA && campaignId) {
      const fetchArtAtickets = async () => {
        if (!artA.id) return;
        const art = await fetchArtById(artA.id);
        setArtARaffleTickets(art?.raffleTickets);
      };
      fetchArtAtickets();
    }

    if (artB && campaignId) {
      const fetchArtBtickets = async () => {
        if (!artA.id) return;
        const art = await fetchArtById(artB.id);
        setArtBRaffleTickets(art?.raffleTickets);
      };
      fetchArtBtickets();
    }

  }, [artA, artB, refresh])

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (error) return <p>Error fetching battle details: {error}</p>;

  const handleToolClick = (id: string) => {
    setViewTools((prevTools) =>
      prevTools.map((tool) =>
        tool.id === id ? { ...tool, active: true } : { ...tool, active: false }
      )
    );
  };

  const isMobile = window.innerWidth <= 768; // Mobile screen width threshold

  useEffect(() => {
    if (isMobile) {
      setViewTools((prevTools) =>
        prevTools.map((tool) =>
          tool.id === "slide" ? { ...tool, active: true } : { ...tool, active: false }
        )
      );
    }
  }, []);

  return (
    <>
      <div className={`hero-section ${pathName === "/" ? "mt-[6rem]" : "mt-0"} pt-[0.6rem] w-full h-auto pb-[0.5rem] flex flex-col items-center justify-center bg-black`}>
        <div className="bottom-hero w-full h-auto">
          <div className="top-hero md:mt-5 mt-0 flex flex-col md:flex-row w-full items-center justify-between pb-[0.6rem] xl:px-[15.5rem] lg:px-[10rem] md:px-[5rem] px-3 py-[0.5rem]">
            {timeRemaining !== null ? (
              <div className="top-hero-left md:w-auto w-full flex items-center md:justify-center justify-between md:gap-[2.5rem]">
                <h3 className="font-semibold spartan-semibold text-lg md:text-xl timer">Time left to vote</h3>
                <h2 className="font-semibold spartan-bold text-2xl md:text-3xl timer"> {" "} {formatTime(timeRemaining)}{" "}</h2>
              </div>
            ) : (
              <div></div>
            )}
            <div className="top-hero-right md:w-auto w-full flex md:justify-center justify-start md:py-0 py-4 gap-3">
              {viewTools.map((tool) => (
                <div key={tool.id} onClick={() => handleToolClick(tool.id)} className={`view-bar cursor-pointer rounded-md p-2 ${tool.active ? "active" : ""}`}>
                  <InlineSVG
                    src={tool.path}
                    color={tool?.active ? "#00F900" : "#ffffff"}
                    className="fill-current h-5 w-5 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="welcome-note md:mt-5 w-full md:px-[11.5rem] px-3">
            {campaignId == GFX_CAMPAIGNID ? (
              <h2 className="text-white text-center md:text-xl text-sm font-small spartan-light welcome-text">
                Welcome to Graphics Versus! Vote daily to collect NFTs and shape
                our favorite $20 winner, awarded every Wednesday. Each vote
                gives you a shot at the day's exclusive 1:1 rare spinner.
                Connect your NEAR wallet and dive into the action!
              </h2>
            ) : (
              <h2 className="text-white md:text-center text-justify md:text-xl text-sm font-small spartan-light welcome-text">
                {welcomeText}
              </h2>
            )}
          </div>
          <div className="arts flex w-full px-3">
            {!todayBattle && !loading && <NoBattle toggleUploadModal={toggleUploadModal} />}
            {loading && <Loader md="22" sm="15" />}
            {todayBattle && viewTools[0].active && (
              <Split artA={artA} artB={artB} artATickets={artARaffleTickets} artBTickets={artBRaffleTickets} artAMyTickets={artAMyTickets} artBMyTickets={artBMyTickets} handleImageClick={handleImageClick} />
            )}
            {todayBattle && viewTools[1].active && (
              <Slider artA={artA} artB={artB} />
            )}
            {todayBattle && viewTools[2].active && (
              <Spinner spinnerUrl={spinnerUrl} />
            )}
          </div>

          {todayBattle && (
            <div className={`battle-vote-btns md:flex ${viewTools[0].active ? "hidden" : "flex"} w-full flex items-center h-auto mt-8 pb-5 px-3`}>
              <div className={`vote-btn w-[50%] flex justify-center md:justify-end ${viewTools[1].active || viewTools[2].active ? "xl:pr-[9rem] md:pr-[8rem]" : "md:pr-[8.5rem]"}`}>
                {/* <div className={`total-collects md:flex  justify-center gap-2 hidden w-auto ${!viewTools[0].active ? "min-w-[12rem]" : "min-w-[10rem]"} h-auto rounded-[3.5rem] px-[2rem] py-[0.8rem] cursor-pointer`}>
                  {!viewTools[0].active && <div className="like w-[1.7rem] h-[1.7rem] pt-1 bg-white flex justify-center items-center rounded-full" onClick={() => handleImageClick(artA?.id)}>
                    <InlineSVG
                      src={`/icons/${artAMyTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                      className="w-5 h-5 spartan-medium"
                    />
                  </div>}
                  <h2 className="font-semibold text-lg text-center">Art A <span className="text-green font-semibold text-lg text-center">{artARaffleTickets}</span></h2>
                </div> */}
                <div className="outside flex w-auto h-auto rounded-[3.5rem] cursor-pointer"> {/** onClick={() => setOpenArtA(true)} */}
                  <div className="second-layer w-auto h-auto rounded-[3.5rem]">
                    <button className={` battle-vote-btn flex flex-row justify-center items-center md:gap-2 gap-1 ${viewTools[0].active && "py-3"} ${viewTools[2].active && isMobile? "px-5 py-2" : "px-6 py-3"} ${isMobile ? "min-w-[10rem]" : "min-w-[12rem]"} rounded-[3.5rem] cursor-pointer`} >
                      {!viewTools[0].active && <div className={`like w-[1.7rem] h-[1.7rem] ${artAMyTickets > 0 ?  "pt-0" : "pt-1"} bg-white flex justify-center items-center rounded-full`} onClick={() => handleImageClick(artA?.id)}>
                        <InlineSVG
                          src={`/icons/${artAMyTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                          className="w-5 h-5 spartan-medium"
                        />
                      </div>}
                      <h2 className="md:spartan-bold spartan-semibold flex flex-row gap-[5px] font-bold md:text-md text-xs">{viewTools[2]?.active && todayBattle?.emoji1} Art A {viewTools[2].active && isMobile && <br />} <span className='ml-1 text-green'>{artARaffleTickets}</span></h2>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`vote-btn w-[50%] flex justify-center md:justify-start ${viewTools[1].active || viewTools[2].active ? "xl:pl-[9rem] md:pl-[8rem]" : "md:pl-[8.5rem]"} `}>
                {/* <div className={`total-collects md:flex justify-center gap-2 hidden w-auto ${!viewTools[0].active ? "min-w-[12rem]" : "min-w-[10rem]"} h-auto rounded-[3.5rem] px-[2rem] py-[0.8rem] cursor-pointer`}>
                  {!viewTools[0].active && <div className="like w-[1.7rem] h-[1.7rem] pt-1 bg-white flex justify-center items-center rounded-full" onClick={() => handleImageClick(artA?.id)}>
                    <InlineSVG
                      src={`/icons/${artAMyTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                      className="w-5 h-5 spartan-medium"
                    />
                  </div>}
                  <h2 className="font-semibold text-lg">Art B <span className="text-green font-semibold text-lg">{artBRaffleTickets}</span></h2>
                </div> */}
                <div className="outside flex w-auto h-auto rounded-[3.5rem]">
                  <div className="second-layer w-auto h-auto rounded-[3.5rem]">
                    <button className={` battle-vote-btn flex justify-center items-center md:gap-2 gap-1 ${viewTools[0].active && "py-3"} ${viewTools[2].active && isMobile ? "px-5 py-2" : "px-6 py-3"} ${isMobile ? "min-w-[10rem]" : "min-w-[12rem]"} rounded-[3.5rem] cursor-pointer`}>
                      {!viewTools[0].active && <div className={`like w-[1.7rem] h-[1.7rem] ${artBMyTickets > 0 ?  "pt-0" : "pt-1"} bg-white flex justify-center items-center rounded-full`} onClick={() => handleImageClick(artB?.id)}>
                        <InlineSVG
                          src={`/icons/${artBMyTickets > 0 ? "uparrow.svg" : "heart.svg"}`}
                          className="w-5 h-5 spartan-medium"
                        />
                      </div>}
                      <h2 className="md:spartan-bold flex flex-row gap-[5px] spartan-semibold text-center font-bold md:text-md text-xs">{viewTools[2]?.active && todayBattle?.emoji2} Art B {viewTools[2].active && isMobile && <br />} <span className='ml-1 text-green'>{artBRaffleTickets}</span>
                      </h2>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedArtId && overlayArt && <BuyRafflePopup overlayArt={overlayArt} setRefresh={setRefresh} campaignId={campaignId} setSuccess={setSuccess} myTickets={overlayArt?._id === artA?.id ? artAMyTickets : artBMyTickets} setSelectedArtId={setSelectedArtId} setErr={setErr} setErrMsg={setErrMsg} setSignToast={setSignToast} />}
      {signToast && <SignInPopup infoMsg="To collect an art or upload an art you need to sign in" text="Sign In to Collect a Raffle Ticket!" onClose={() => { setSignToast(false); setSelectedArtId(overlayArt?._id || "") }} />}
      {success && <Toast
        success={true}
        message={"Raffle Tickets Collected!"}
        onClose={() => setSuccess(false)}
      />}
      {toastMessage && (
        <Toast
          success={true}
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};
