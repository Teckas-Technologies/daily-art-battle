"use client";
import React, { useState, useEffect } from "react";
import { useFetchArts, ArtData, useFetchArtById } from "@/hooks/artHooks";
import { useMbWallet } from "@mintbase-js/react";
import Image from "next/image";
import { useVoting, Vote } from "@/hooks/useArtVoting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import "./UpcomingHeader.css";
const UpcomingHeader: React.FC<{
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
    <section id="upcoming-header">
      <div className="upcoming-header">
        <div className="content">
          <p className="upcoming-subHeading">UPVOTE YOUR FAVORITE ARTS</p>
          <div className="upcoming-heading spartan-bold">
            Upcoming <span>Art Battles</span>
          </div>

          <p className="description text-center text-xs md:text-base md:w-[600px] mx-auto mt-4">
            Upvote your favorite artworks to influence what will be up for
            battle next. Think you’ve got what it takes? Upload your own
            masterpiece and join the competition!
          </p>

          <div className="uploadButtonWrapper">
            <button onClick={toggleUploadModal}
              // disabled={!isConnected}
              className="uploadButton px-4 md:mr-5 py-2 vote-btn text-black bg-white hover:bg-gray-300 rounded" 
              >Upload your Art</button>

            <div className="uploadButtonBorder" />

            <div className="uploadButtonOverlay" />
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
export default UpcomingHeader;
