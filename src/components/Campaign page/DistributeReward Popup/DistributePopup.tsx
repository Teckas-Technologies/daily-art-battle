import { useEffect, useRef, useState } from "react";
import "./DistributePopup.css";
import InlineSVG from "react-inlinesvg";
import useInfiniteScroll from "@/hooks/InfiniteScroll";
import Loader from "@/components/ArtBattle/Loader/Loader";
import { ArtItem } from "@/hooks/CampaignHook";

interface DistributeRewardPopupProps {
  onClose: () => void;
  campaignId: string;
  selectedArt: number[];
  toggleSelection: (index: number) => void;
  handlePopups: () => void;
  SpecialWinnerCount: number | "";
  art: ArtItem[];
  idToken: string;
  artLength: number;
}

const DistributeRewardPopup: React.FC<DistributeRewardPopupProps> = ({
  onClose,
  campaignId,
  selectedArt,
  toggleSelection,
  handlePopups,
  SpecialWinnerCount,
  art,
  idToken,
  artLength,
}) => {
  const maxSelections =
    typeof SpecialWinnerCount === "number" ? SpecialWinnerCount : 0;

  const isLimitReached = selectedArt.length >= maxSelections;

  const { artItems, isLoading, hasMore, loadMore } =
    useInfiniteScroll(campaignId);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const container = popupRef.current;

    if (container) {
      const scrollBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      if (scrollBottom <= 0 && hasMore && !isLoading) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const container = popupRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="distribute-popup" ref={popupRef}>
      <h1>Distribute Rewards</h1>
      <div className="grid">
        {artItems.map((item, index) => {
          const isSelected = selectedArt.includes(index);
          const isDisabled = isLimitReached && !isSelected;

          return (
            <div
              key={item._id}
              className={`distribute-card ${isSelected ? "selected" : ""} ${
                isDisabled ? "disabled" : ""
              }`}
              onClick={() => {
                if (!isDisabled || isSelected) {
                  toggleSelection(index);
                }
              }}
              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
            >
              <img
                src={item.colouredArt}
                alt={item.arttitle}
                className="user-image"
              />
              <div className={`checkmark ${isSelected ? "selected" : ""}`}>
                {isSelected && <InlineSVG src="/icons/tick.svg" />}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {item.artistId.length > 10
                    ? `${item.artistId.slice(0, 10)}...`
                    : item.artistId}
                </span>
                <span className="user-upvotes flex flex-row items-center gap-1">
                  <InlineSVG
                    src="/icons/heart.svg"
                    className="w-[15px] h-[15px]"
                  />{" "}
                  {item.upVotes} <span className="hidden md:flex">Upvotes</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading && <Loader sm="10" md="15" />}
      <div className="footer">
        <div className="reward-result">
          Selected {selectedArt.length} out of {artLength} Participants
        </div>
        <div className="actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          {selectedArt.length > 0 ? (
            <div className="distributepopup-btn-Wrapper">
              <button className="distributepopup-btn text-[13px] md:text-[14px]" onClick={handlePopups}>
                Distribute Rewards
              </button>
              <div className="distributepopup-btn-Border" />
              <div className="distributepopup-btn-Overlay" />
            </div>
          ) : (
            <button className="disable-distribute">Distribute Rewards</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributeRewardPopup;
