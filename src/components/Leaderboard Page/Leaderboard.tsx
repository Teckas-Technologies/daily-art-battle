import React from "react";
import "./Leaderboard.css";
import InlineSVG from "react-inlinesvg";

const leaderboardData = [
  { rank: 1, name: "Raghuvaran Karthik", points: 4567 },
  { rank: 2, name: "Raghuvaran Karthik", points: 4567 },
  { rank: 3, name: "Raghuvaran Karthik", points: 4567 },
  { rank: 4, name: "Raghuvaran Karthik", points: 4567 },
  { rank: 5, name: "Raghuvaran Karthik", points: 4567 },
  { rank: 6, name: "Raghuvaran Karthik", points: 4567 },
];

const LeaderboardSection = () => (
  <div className="leaderboard-container">
    <h1 className="leaderboard-title">GFXvs Leaderboard</h1>
    <p className="leaderboard-subtitle">
      Stand in the top by collecting highest gfx points
    </p>

    <div className="rank-container">
      <div className="user-list">
        <div className="header">
          <span className="header-item">Rank</span>
          <span className="header-item">Username</span>
          <span className="header-item">GFX Points</span>
        </div>

        {leaderboardData.map((user, index) => (
          <div
            key={index}
            className={`row ${
              user.rank === 1
                ? "first-rank"
                : user.rank === 2
                ? "second-rank"
                : user.rank === 3
                ? "third-rank"
                : ""
            }`}
          >
            <span
              className="rank"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "20.16px",
                letterSpacing: "-0.06em",
                textAlign: "left",
              }}
            >
              {user.rank === 1 ? (
                <InlineSVG src="/icons/rank1.svg" />
              ) : user.rank === 2 ? (
                <InlineSVG src="/icons/rank2.svg" />
              ) : user.rank === 3 ? (
                <InlineSVG src="/icons/rank3.svg" />
              ) : (
                user.rank
              )}
            </span>

            <span className="username">{user.name}</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {user.rank <= 3 && (
                <InlineSVG
                  src={`/icons/coin${user.rank}.svg`}
                  style={{ width: "19.1px", height: "19.1px" }}
                />
              )}
              <span style={{ textAlign: "right" }}>{user.points}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="top-rankings">
        <h2>Top Rankings</h2>
        {leaderboardData
          .filter((user) => user.rank <= 3)
          .map((user) => (
            <div
              key={user.rank}
              className={`top-user ${
                user.rank === 1
                  ? "first-rank-div"
                  : user.rank === 2
                  ? "second-rank-div"
                  : "third-rank-div"
              }`}
            >
              <img
                src="/images/profile.jpg"
                alt="User Profile"
                className="profile-img"
              />
              <span
                className="user-info"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "17.28px",
                  fontWeight: "600",
                  letterSpacing: "-6%",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "20.16px",
                    letterSpacing: "-0.06em",
                    textAlign: "left",
                  }}
                >
                  {user.name}
                </span>
                <span style={{ display: "flex" }}>
                  <InlineSVG
                    src="/icons/coin1.svg"
                    style={{
                      width: "28.5px",
                      height: "28.5px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                  />
                  <span className="points">{user.points}</span>
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  </div>
);

export default LeaderboardSection;
