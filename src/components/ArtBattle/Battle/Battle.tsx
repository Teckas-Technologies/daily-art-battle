"use client";
import InlineSVG from "react-inlinesvg";
import { Slider } from "./Slider/Slider";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner/Spinner";
import { useMbWallet } from "@mintbase-js/react";
import { useFetchTodayBattle } from "@/hooks/battleHooks";
import { useRouter } from "next/navigation";
import { useVoting } from "@/hooks/useVoting";
import { GFX_CAMPAIGNID } from "@/config/constants";
import { NoBattle } from "./NoBattle/NoBattle";
import Toast from "../../Toast";
import "./Battle.css";
import { Split } from "./Split/Split";
import Loader from "../Loader/Loader";
import { useTodayBattleSpinner } from "@/hooks/useTodayBattleSpinner";

interface Artwork {
  id: string;
  imageUrl: string;
  name: string;
  title: string;
  artistId: string;
}

interface Props {
  toggleUploadModal: () => void;
  campaignId: string;
  fontColor: string;
  welcomeText: string;
  themeTitle: String;
}
interface Response {
  spinnerUrl: string;
  metadata: string;
  emoji1: string;
  emoji2: string;
  battleId: string;
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
}) => {
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { todayBattle, loading, battle, error, fetchTodayBattle } =
    useFetchTodayBattle();
  const router = useRouter();

  const [artA, setArtA] = useState<Artwork>({
    id: "ArtA",
    name: "Art A",
    imageUrl: "",
    title: "",
    artistId: "",
  });
  const [artB, setArtB] = useState<Artwork>({
    id: "ArtB",
    name: "Art B",
    imageUrl: "",
    title: "",
    artistId: "",
  });

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [battleId, setBattleId] = useState<string>();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [votedFor, setVoterFor] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [popupA, setPopUpA] = useState(false);
  const [popupB, setPopUpB] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [skeletonLoad, setSkeletonLoading] = useState(true);
  const { fetchTodayBattleSpinner } = useTodayBattleSpinner();
  const [spinner, setSpinner] = useState<Response | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (todayBattle && activeAccountId) {
        const res = await fetchVotes(
          activeAccountId,
          todayBattle._id,
          campaignId
        );
        if (res) {
          setVoterFor(res.votedFor);
          setSuccess(true);
        }
      }
    };
    fetchData();
  }, [todayBattle, fetchVotes, refresh]);

  const handleCampaign = () => {
    router.push(`/campaigns`);
  };

  useEffect(() => {
    console.log(campaignId);

    const fetchBattle = async () => {
      await fetchTodayBattle(campaignId);
    };

    const timeoutId = setTimeout(() => {
      fetchBattle();
    }, 10000); // 10 seconds in milliseconds

    // Cleanup function to clear the timeout if the component unmounts or campaignId changes
    return () => clearTimeout(timeoutId);
  }, [campaignId]);

  useEffect(() => {
    if (battle) {
      console.log(battle);
      setSkeletonLoading(false);
    }
  }, [battle]);

  useEffect(() => {
    if (!battle && todayBattle) {
      setSkeletonLoading(false);
    }
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

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (todayBattle) {
      setArtA({
        id: "Art A",
        name: "Art A",
        imageUrl: todayBattle.artAcolouredArt,
        title: todayBattle.artAtitle,
        artistId: todayBattle.artAartistId,
      });
      setArtB({
        id: "Art B",
        name: "Art B",
        imageUrl: todayBattle.artBcolouredArt,
        title: todayBattle.artBtitle,
        artistId: todayBattle.artBartistId,
      });
      setBattleId(todayBattle._id);
    }
  }, [todayBattle]);

  const onVote = async (id: string) => {
    if (!isConnected || !activeAccountId) {
      await connect();
      return;
    }
    if (!battleId) {
      alert("Battle not loaded!");
      return;
    }
    const success = await submitVote({
      participantId: activeAccountId,
      battleId: battleId,
      votedFor: id === "Art A" ? "Art A" : "Art B",
      campaignId: campaignId,
    });
    if (success) {
      console.log("Voted");
      setSuccess(true);
      setToastMessage("Vote submitted successfully!");
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      setRefresh((prev) => !prev);
    } else {
      alert("Failed to submit vote. Maybe you already voted!");
    }
  };

  if (error) return <p>Error fetching battle details: {error}</p>;

  const [viewTools, setViewTools] = useState(initialViewTools);

  const handleToolClick = (id: string) => {
    setViewTools((prevTools) =>
      prevTools.map((tool) =>
        tool.id === id ? { ...tool, active: true } : { ...tool, active: false }
      )
    );
  };
  useEffect(() => {
    const fetchSpinner = async () => {
      const data = await fetchTodayBattleSpinner();
      console.log("spinner", data);
      setSpinner(data);
    };
    fetchSpinner();
  }, []);
  return (
    <>
      <div className="hero-section mt-[7rem] pt-[0.6rem] w-full h-auto pb-[3rem] flex flex-col items-center justify-center bg-black">
        <div className="bottom-hero w-full h-auto">
          <div className="top-hero md:mt-5 mt-0 flex flex-col md:flex-row w-full items-center justify-between pb-[0.6rem] md:px-[16.5rem] px-3 py-[0.5rem]">
            {timeRemaining !== null ? (
              <div className="top-hero-left md:w-auto w-full flex items-center md:justify-center justify-between md:gap-[2.5rem]">
                <h3 className="font-semibold spartan-semibold text-lg md:text-xl timer">
                  Time left to vote
                </h3>
                <h2 className="font-semibold spartan-bold text-2xl md:text-3xl timer">
                  {" "}
                  {formatTime(timeRemaining)}{" "}
                </h2>
              </div>
            ) : (
              <div></div>
            )}
            <div className="top-hero-right md:w-auto w-full flex md:justify-center justify-start md:py-0 py-4 gap-3">
              {viewTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`view-bar cursor-pointer rounded-md p-2 ${
                    tool.active ? "active" : ""
                  }`}
                >
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
            {!todayBattle && !loading && <NoBattle />}
            {loading && <Loader />}
            {todayBattle && viewTools[0].active && (
              <Split artA={artA} artB={artB} onVote={onVote} success={success} votedFor={votedFor} viewTools={viewTools} />
            )}
            {todayBattle && viewTools[1].active && (
              <Slider artA={artA} artB={artB} />
            )}
            {todayBattle && viewTools[2].active && (
              <Spinner spinner={spinner} />
            )}
          </div>

          {todayBattle && (
            <div className={`battle-vote-btns md:flex ${viewTools[0].active ? "hidden" : "flex" } w-full flex items-center h-auto mt-8 pb-5 px-3`}>
              <div
                className={`vote-btn w-[50%] flex justify-center pr-8 md:justify-end ${
                  viewTools[1].active || viewTools[2].active
                    ? "md:pr-[8rem]"
                    : "md:pr-[12.5rem]"
                }`}
              >
                <div className="outside w-auto h-auto rounded-3xl">
                  <div className="second-layer w-auto h-auto rounded-3xl">
                    <button
                      onClick={() => onVote(artA.id)}
                      disabled={!isConnected || success}
                      className={`${!isConnected || success ? "cursor-not-allowed" : "cursor-pointer"} battle-vote-btn px-5 py-3 rounded-3xl`}
                    >
                      <h2 className="md:spartan-bold spartan-semibold font-bold text-xs md:text-sm">
                        {votedFor === artA.name
                          ? "Voted Art A"
                          : viewTools[1].active || viewTools[2].active
                          ? "Vote for Art A"
                          : "Vote here"}
                      </h2>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`vote-btn w-[50%] flex justify-center pl-8 md:justify-start ${
                  viewTools[1].active || viewTools[2].active
                    ? "md:pl-[8rem]"
                    : "md:pl-[12.5rem]"
                } `}
              >
                <div className="outside2 w-auto h-auto rounded-3xl">
                  <div className="second-layer2 w-auto h-auto rounded-3xl">
                    <button
                      onClick={() => onVote(artB.id)}
                      disabled={!isConnected || success}
                      className={`${
                        !isConnected || success ? "cursor-not-allowed" : "cursor-pointer"
                      } battle-vote-btn px-5 py-3 border border-green-600 rounded-3xl`}
                    >
                      <h2 className="md:spartan-bold spartan-semibold font-bold text-xs md:text-sm">
                        {votedFor === artB.name
                          ? "Voted Art B"
                          : viewTools[1].active || viewTools[2].active
                          ? "Vote for Art B"
                          : "Vote here"}
                      </h2>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* {todayBattle && <div className={`battle-vote-btns w-full flex items-center h-auto mt-8 pb-5 px-3`}>
                        <div className={`vote-btn w-[50%] flex justify-center pr-8 md:justify-end ${viewTools[1].active || viewTools[2].active ? "md:pr-[8rem]" : "md:pr-[12.5rem]"}`}>
                            <button onClick={() => onVote(artA.id)} disabled={!isConnected || success} className={`${!isConnected || success ? "cursor-not-allowed" : ""} battle-vote-btn px-5 py-3 border border-green-600 rounded-3xl cursor-pointer`}>
                                <h2 className='md:spartan-bold spartan-semibold font-bold text-xs md:text-sm'>{votedFor === artA.name ? "Voted ART A" : viewTools[1].active || viewTools[2].active ? "Vote for Art A" : "Vote here"}</h2>
                            </button>
                        </div>
                        <div className={`vote-btn w-[50%] flex justify-center pl-8 md:justify-start ${viewTools[1].active || viewTools[2].active ? "md:pl-[8rem]" : "md:pl-[12.5rem]"} `}>
                            <button onClick={() => onVote(artB.id)} disabled={!isConnected || success} className={`${!isConnected || success ? "cursor-not-allowed" : ""} battle-vote-btn px-5 py-3 border border-green-600 rounded-3xl cursor-pointer`}>
                                <h2 className='md:spartan-bold spartan-semibold font-bold text-xs md:text-sm'>{votedFor === artB.name ? "Voted ART B" : viewTools[1].active || viewTools[2].active ? "Vote for Art B" : "Vote here"}</h2>
                            </button>
                        </div>
                    </div>} */}
        </div>
      </div>
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
