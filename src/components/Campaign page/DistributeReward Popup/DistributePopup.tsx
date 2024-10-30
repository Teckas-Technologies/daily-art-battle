import { useState } from "react";
import "./DistributePopup.css";
import InlineSVG from "react-inlinesvg";
interface DistributeRewardPopupProps {
  onDistribute: () => void;
  onClose: () => void;
}

const DistributeRewardPopup: React.FC<DistributeRewardPopupProps> = ({
  onDistribute,
  onClose,
}) => {
  const users = Array(9).fill({ name: "Raghuvaran", upvotes: 9 });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const toggleSelection = (index: number) => {
    if (selectedUsers.includes(index)) {
      setSelectedUsers(selectedUsers.filter((i) => i !== index));
    } else {
      setSelectedUsers([...selectedUsers, index]);
    }
  };

  return (
    <div className="popup">
      <h1>Distribute Rewards</h1>
      <div className="grid">
        {users.map((user, index: number) => (
          <div
            key={index}
            className={`card ${
              selectedUsers.includes(index) ? "selected" : ""
            }`}
            onClick={() => toggleSelection(index)}
          >
            <img
              src="/images/image.png"
              alt="User"
              className="user-image"
            />

            <div
              className={`checkmark ${
                selectedUsers.includes(index) ? "selected" : ""
              }`}
            >
              {selectedUsers.includes(index) && (
                <InlineSVG src="/icons/tick.svg" />
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-upvotes flex flex-row items-center">
                <InlineSVG
                  src="/icons/heart.svg"
                  className="w-[15px] h[15px]"
                />{" "}
                {user.upvotes} Upvotes
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="reward-result">Selected 2 out of 5 Participants</div>
        <div className="actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <div className="distributepopup-btn-Wrapper">
            <button className="distributepopup-btn " onClick={onDistribute}>
              Distribute Rewards
            </button>

            <div className="distributepopup-btn-Border" />

            <div className="distributepopup-btn-Overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributeRewardPopup;
