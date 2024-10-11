"use client";
import React, { useState, useEffect } from "react";
import { useFetchArts, ArtData, useFetchArtById } from "../hooks/artHooks";
import { useMbWallet } from "@mintbase-js/react";
import Image from "next/image";
import Overlay from "./Overlay";
import { useVoting, Vote } from "../hooks/useArtVoting";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
const UpcomingArtTable: React.FC<{
  toggleUploadModal: () => void;
  uploadSuccess: boolean;
  campaignId: string;
  fontColor: string;
}> = ({ toggleUploadModal, uploadSuccess, campaignId, fontColor }) => {
  const [upcomingArts, setUpcomingArts] = useState<ArtData[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { arts, totalPage, error, fetchMoreArts } = useFetchArts();
  const { isConnected } = useMbWallet();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("dateDsc");

  //console.log(arts);
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortType = event.target.value;
    setSort(sortType);
    setPage(1); // Reset to first page when sorting
    fetchMoreArts(campaignId, sortType, 1);
  };

  useEffect(() => {
    const initializeData = async () => {
      fetchMoreArts(campaignId, sort, page);
    };
    const timeoutId = setTimeout(initializeData, 1000);

    return () => clearTimeout(timeoutId);
  }, [sort, page, refresh, uploadSuccess, fetchMoreArts]);

  const [hasnext, setHasNext] = useState(false);

  useEffect(() => {
    if (arts) {
      if (page <= totalPage - 1) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
    setUpcomingArts(arts);
  }, [arts]);

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
    fetchMoreArts(campaignId, sort, page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      fetchMoreArts(campaignId, sort, page - 1);
    }
  };

  return (
    <section id="upcoming">
      <div className="main w-[1921px] h-[2157px]">
        <div
          className="rect w-[1920px] h-[574px]"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, #000000 102.7%), url("/images/image7.png")',
            backgroundSize: "cover",
            width: "1920px",
            height: "571px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="content"
            style={{
              width: "934px",
              height: "236px",
              gap: "0px",
              top: "141px",
              left: "494px",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              className="head-text"
              style={{
                width: "423px",
                height: "56px",
                padding: "13.07px 0px 13.07px 0px",
                gap: "0px",
                borderRadius: "37.19px 0px 0px 0px",
                opacity: "0px",
              }}
            >
              <p
                style={{
                  width: "389px",
                  height: "22px",
                  gap: "0px",
                  opacity: 1,
                  fontFamily: "'Spartan', sans-serif",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: "26.88px",
                  letterSpacing: "-0.03em",
                  textAlign: "center",
                  background:
                    "linear-gradient(180deg, #FFFFFF 47.78%, #CFCFCF 79.63%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                UPVOTE YOUR FAVORITE ARTS
              </p>
            </div>
            <div
              className="body-text"
              style={{
                width: "934px",
                height: "192px",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                opacity: 1,
              }}
            >
              <div
                className="title"
                style={{
                  width: "821px",
                  height: "116px",
                  display: "flex",
                  padding: "0 50px",
                }}
              >
                <div
                  style={{
                    width: "418px",
                    height: "116px",
                    padding: "0px",
                    gap: "0px",
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "flex-end", 
                  }}
                >
                  <p
                    style={{
                      width: "398px",
                      height: "96px",
                      margin: "0", 
                      fontFamily: "'Spartan', sans-serif",
                      fontSize: "78px",
                      fontWeight: "600",
                      lineHeight: "96.36px",
                      letterSpacing: "-0.06em",
                      textAlign: "left",
                      background:
                        "background: linear-gradient(180deg, #FFFFFF 40%, #999999 100%)",
                      WebkitBackgroundClip: "text",
                      color: "#FFFFFF",
                    }}
                  >
                    Upcoming
                  </p>
                </div>

                <div
                  style={{
                    width: "414px",
                    height: "116px",
                    padding: "0px", 
                    gap: "0px", 
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <p
                    style={{
                      width: "394px",
                      height: "96px",
                      margin: "0", 
                      fontFamily: "'Spartan', sans-serif",
                      fontSize: "78px",
                      fontWeight: "600",
                      lineHeight: "96.36px",
                      letterSpacing: "-0.06em",
                      textAlign: "left",
                      background:
                        "linear-gradient(180deg, #00FF00 50%, #007200 100%)",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Art Battles
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: "934px",
                  height: "76px",
                  padding: "0px 15px 0px 15px",
                  gap: "0px",
                  opacity: "0px",
                  flexDirection: "column",
                }}
              >
                <div
                  className="py-0 px-[50px]"
                  style={{
                    width: "904px",
                    height: "76px",
                    // padding: '10px 0px 0px 0px',
                    gap: "10px",
                    opacity: "0px",
                    padding: "0 50px",
                  }}
                >
                  <p
                    style={{
                      width: "713px",
                      height: "56px",
                      gap: "0px",
                      opacity: "0px",
                      fontFamily: "'Spartan', sans-serif",
                      fontSize: "18px",
                      fontWeight: "500",
                      lineHeight: "28.26px",
                      letterSpacing: "-0.06em",
                      textAlign: "center",
                      color: "rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    Upvote your favorite artworks to influence what will be up
                    for battle next. Think you’ve got what it takes? Upload your
                    own masterpiece and join the competition!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative", 
              width: "257.84px",
              height: "76px",
            }}
          >
            <button
              style={{
                width: "100%", 
                height: "100%",
                padding: "16.55px 36.92px",
                borderRadius: "47.1px",
                background:
                  "radial-gradient(128.13% 128.13% at 50% 50%, #000000 25%, rgba(0, 255, 0, 0) 100%)", 
                position: "relative", 
                zIndex: 2, 
                border: "none", 
                color: "rgba(255, 255, 255, 1)",
                fontFamily: "'Spartan', sans-serif",
                fontSize: "22.91px",
                fontWeight: "700",
                lineHeight: "25.66px",
                letterSpacing: "-0.06em",
                textAlign: "left",
                display: "flex", 
                alignItems: "center",
                justifyContent: "center", 
              }}
            >
              Upload your Art
            </button>

            <div
              style={{
                content: '""', 
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                borderRadius: "47.1px", 
                padding: "1.27px", 
                background:
                  "linear-gradient(99.76deg, #00FF00 8.86%, rgba(0, 153, 0, 0) 91.14%)", 
                zIndex: 0,
              }}
            />

            <div
              style={{
                content: '""', 
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                borderRadius: "47.1px", 
                background:
                  "linear-gradient(to left, rgba(0, 255, 0, 0.5), transparent 50%)", 
                zIndex: 1, 
              }}
            />
          </div>
        </div>
        <div className="cont" style={{position:"relative", padding: "0 50px",width:  "1718px",height: "1300px",top: "100px",left: "101px",gap: "77px",opacity: "0px",}}>
            <div className="search" style={{width: '1718px', height: '84px', gap: '444px',opacity: '0px',}}>
              <div style={{
                    width: '906px',
                    height: '84px',
                    padding: '11px 37px 11px 29px',
                    gap: '0px',
                    borderRadius: '78px',
                    // border: '1px 0px 0px 0px',
                    opacity: '0px',
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.03) 100%)',
                    border: '1px solid #535353'
                    }}>
                      <div style={{
                        width:  '326px',
                        height: '62px',
                        top: '11px',
                        left: '29px',
                        gap: '21px',
                        opacity: '0px',
                        }}>
                          
                      </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BattleTable: React.FC<{
  artData: ArtData[];
  campaignId: string;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ artData, setRefresh, campaignId }) => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const { votes, fetchVotes, submitVote } = useVoting();
  const [success, setSuccess] = useState(false);
  const [upvotes, setVotes] = useState<Vote[]>([]);
  const router = useRouter();
  const { fetchArtById } = useFetchArtById();
  const [selectedArtId, setSelectedArtId] = useState(null);
  const [overlayArt, setoverlayArt] = useState<ArtData>();

  const getQueryParam = (param: string): string | null => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return url.searchParams.get(param);
    }
    return null;
  };
  const artId = getQueryParam("artId");

  useEffect(() => {
    const fetchArt = async () => {
      if (artId) {
        const overlay = await fetchArtById(artId);
        setoverlayArt(overlay);
      }
    };
    fetchArt();
  }, [artId]);

  const handleImageClick = async (id: any) => {
    setSelectedArtId(id);
    const overlay = await fetchArtById(id);
    setoverlayArt(overlay);
    const url = new URL(window.location.href);
    url.searchParams.set("artId", id);
    window.history.pushState({}, "", url.toString());
  };

  const handleClose = () => {
    setSelectedArtId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("artId");
    window.history.pushState({}, "", url.toString());
  };

  useEffect(() => {
    const fetchUserVotes = async () => {
      if (activeAccountId) {
        const votes = await fetchVotes(activeAccountId, campaignId);
        setVotes(votes);
      }
    };

    fetchUserVotes();
  }, [activeAccountId, fetchVotes]);

  const handleArt = (id: any) => {
    router.push(`/art/${id}`);
  };

  const onVote = async (id: string) => {
    if (!isConnected || !activeAccountId) {
      await connect();
      return;
    }
    if (!id) {
      alert("art  not loaded!");
      return;
    }
    const success = await submitVote({
      participantId: activeAccountId,
      artId: id,
      campaignId: campaignId,
    });

    console.log(success);
    if (success) {
      setSuccess(true);
      const votes = await fetchVotes(activeAccountId, campaignId);
      console.log(votes);
      setVotes(votes);
      //   alert('Vote submitted successfully!');
      setRefresh((prev) => !prev);
    } else {
      alert("Failed to submit vote. Maybe you already voted!");
    }
  };

  return <></>;
};
export default UpcomingArtTable;
