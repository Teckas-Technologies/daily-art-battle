'use client'
import InlineSVG from "react-inlinesvg";
import "./CampaignDetails.css";
import { useState } from "react";
import Image from 'next/image';
const participantsStats = {
  totalParticipants: 24,
  totalVotes: 24,
  totalUpvotes: 24,
  uniqueParticipants: 24,
};

const artworks = [
  { name: "Raghuvaran", image: "/images/art1.jpg", upvotes: 9 },
  { name: "Karthik", image: "/images/art2.jpg", upvotes: 9 },
  { name: "Siri", image: "/images/art3.jpg", upvotes: 9 },
];
const daywinners = [
  { name: "Raghuvaran", image: "/images/uploadart2.png", upvotes: 9 },
  { name: "Karthik", image: "/images/uploadart2.png", upvotes: 9 },
  { name: "Siri", image: "/images/uploadart2.png", upvotes: 9 },
  { name: "Siri", image: "/images/uploadart2.png", upvotes: 9 },
  { name: "Siri", image: "/images/uploadart2.png", upvotes: 9 },
  { name: "Siri", image: "/images/uploadart2.png", upvotes: 9 },
];
const participants = Array(30).fill('Raghuvaran Karthik'); 
const arts = [
  '/images/uploadart2.png',
  '/images/uploadart2.png',
  '/images/uploadart2.png',
  '/images/uploadart2.png',
  '/images/uploadart2.png',
  '/images/uploadart2.png',
];
export default function CampaignDetails() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => setCurrentPage(page);
  return (
    <div className="campaign-details-container">
      <h1>Campaign Ended</h1>

      <div className="art-section">
        <div
          className="flex items-center justify-center"
          style={{ gap: "50px" }}
        >
          <div className="art">
            <div className="flex items-center" style={{ marginBottom: "10px" }}>
              <img
                src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                alt="Profile"
                style={{
                  width: "39px",
                  height: "39px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <h4 style={{ margin: 0 }}>Raghuvaran</h4>{" "}
            </div>

            <img
              src="/images/uploadart1.png"
              alt="Raghuvaran"
              className="image"
            />
            <p
              className="flex items-center justify-end"
              style={{ width: "100%", marginTop: "15px" }}
            >
              <InlineSVG
                src="/icons/heart.svg"
                style={{ marginRight: "5px" }}
              />
              9 Upvotes
            </p>
          </div>

          <div className="art">
            <div className="flex items-center" style={{ marginBottom: "10px" }}>
              <img
                src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                alt="Profile"
                style={{
                  width: "39px",
                  height: "39px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <h4 style={{ margin: 0 }}>Raghuvaran</h4>{" "}
            </div>

            <img
              src="/images/uploadart1.png"
              alt="Raghuvaran"
              className="image"
            />
            <p
              className="flex items-center justify-end"
              style={{ width: "100%", marginTop: "15px" }}
            >
              <InlineSVG
                src="/icons/heart.svg"
                style={{ marginRight: "5px" }}
              />
              9 Upvotes
            </p>
          </div>
        </div>

        <div
          className="art-details"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div>
            <h3>Total Participants</h3>
            <p>{participantsStats.totalParticipants}</p>
          </div>
          <div>
            <h3>Total Votes</h3>
            <p>{participantsStats.totalVotes}</p>
          </div>
          <div>
            <h3>Total Upvotes</h3>
            <p>{participantsStats.totalUpvotes}</p>
          </div>
          <div>
            <h3>Unique Participants</h3>
            <p>{participantsStats.uniqueParticipants}</p>
          </div>
        </div>
      </div>

      <div className="special-winner">
        <h2>Special Rewards Winners</h2>
        <div className="winnersGrid">
          {artworks.map((art, index) => (
            <div className="winner" key={index}>
              <div
                className="flex items-center"
                style={{ marginBottom: "10px" }}
              >
                <img
                  src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                  alt="Profile"
                  style={{
                    width: "39px",
                    height: "39px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <h4 style={{ margin: 0 }}>Raghuvaran</h4>{" "}
              </div>
              <img
                src="/images/uploadart1.png"
                alt={art.name}
                className="image"
              />

              <p
                className="flex items-center justify-end"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <InlineSVG
                  src="/icons/heart.svg"
                  style={{ marginRight: "5px" }}
                />
                9 upvotes
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="daywise-winners">
        <h2>Day Wise Winners</h2>
        <div className="daywise-winners-grid">
          {daywinners.map((art, index) => (
            <div className="daywise-winner" key={index}>
              <div className="profile-section">
                <img
                  src="https://s3-alpha-sig.figma.com/img/b437/5247/c9ed39b90ad6de42f855680cf4d8f730?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X5GMnZ2xAnXog2hCj~mh6VB2BoeRaGAcqbyEjyv5OSkjZ2JhA1VeiNQp2TfH1vS~GkQwQezTFOufqD-M7OMBVgUOHztWTq833Fg5kFmnDiKjQiiS9yqW9V262fofSojIu1pkOrNm3~Q3QSngTjDDtpkKCL7s3lgxSylFCgc72ypQH25khte1VWpKg42J1smWQepV9Xz-yWSDeCt5PJIKdXFvGDmYeogjoZaCeCGkwUpLofTVyFVmB4jnq6BOhJUxGoZMiuO-nh3s~ydmjmmyay6y~IQLDEaoKAJ03j8niwCiVmgV6BWN-wkldw5XEGGbaEIxTDI2f4JLbrhD7KW7dg__"
                  alt="Profile"
                  className="profile-image"
                  style={{
                    width: "39px",
                    height: "39px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <h4>Raghuvaran</h4>
              </div>
              <img
                src="/images/uploadart1.png"
                alt={art.name}
                className="art-image"
              />
              <p
                className="flex items-center justify-end"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <InlineSVG src="/icons/heart.svg" className="heart-icon" />9
                upvotes
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="summary">
    
      <div className="participants">
        <h2>Participants</h2>
        {participants.map((participant, index) => (
          <div key={index} className="participant">
            {index + 1}. {participant}
          </div>
        ))}
      </div>

   
      <div className="summary-arts">
        <h2>Arts</h2>
        <div className="arts-grid">
          {arts.map((art, index) => (
            <div key={index} className="art-card">
              <img src={art} alt={`Art ${index + 1}`} width={300} height={300} />
              <button className="reward-btn">Give Reward</button>
            </div>
          ))}
        </div>

       
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt; Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={currentPage === page ? 'active' : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Next &gt;
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
