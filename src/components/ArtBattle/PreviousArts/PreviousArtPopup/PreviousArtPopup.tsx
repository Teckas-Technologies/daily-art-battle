import React from "react";
import "./PreviousArtPopup.css";
import InlineSVG from "react-inlinesvg";
interface EditProfilePopupProps {
  onClose: () => void;
}
const PreviousArtPopup: React.FC<EditProfilePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-50">
      <div
        className="bg-[#000000] text-white rounded-2xl w-[80%] md:w-[700px] p-4 relative md:overflow-hidden overflow-y-auto hide-scrollbar"
        style={{ border: "1px solid #8B8B8B", maxHeight: "95vh" }}
      >
        <button className="absolute top-6 right-6" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" className="w-6 h-6 " />
        </button>

        <h2 className="text-center text-sm font-medium text-[#00FF00] mb-[40px] md:mb-[30px] md:text-xl md:font-semibold md:mt-[20px] md:mt-0 mt-[20px]">
          Previous Art Battle Info
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-[70px]">
        <div className="flex flex-col items-center">
            <img
              src="/images/uploadart1.png"
              alt="Artwork 1"
              className="md:w-[250px] w-[200px] h-[200px] md:h-[250px] object-cover rounded-xl"
              style={{ border: "1px solid #515151" }}
            />

            <div className="flex mt-5 md:w-[250px] justify-between w-[180px]">
              <p className="text-[#00FF00] flex items-center gap-2">
                <InlineSVG src="/icons/profile-green.svg" className="w-4 h-4" />
                <span className="text-[10px] md:text-sm">Raghuvaran</span>
              </p>
              <p className="text-yellow-400 flex items-center gap-1 text-[10px] md:text-sm">
                <InlineSVG src="/icons/cup.svg" className="w-5 h-5" /> Winner
              </p>
            </div>

            <div className="mt-4 text-left space-y-4">
              <p className="text-white flex">
                <span className="text-[10px] md:text-sm md:w-[130px] w-[100px]">Total votes:</span>
                <span className="text-[#00FF00] text-[10px] md:text-sm">24</span>
              </p>
              <p className="text-white flex">
                <span className="text-[10px] md:text-sm md:w-[130px] w-[100px]">Total Upvotes:</span>
                <span className="text-[#00FF00] text-[10px] md:text-sm">48</span>
              </p>
              <p className="text-white flex">
                <span className="text-[10px] md:text-sm md:w-[130px] w-[100px]">Date of Battle:</span>
                <span className="text-[#00FF00] text-[10px] md:text-sm">
                  12 October 2024
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/uploadart1.png"
              alt="Artwork 1"
              className="md:w-[250px] w-[200px] h-[200px] md:h-[250px] object-cover rounded-xl"
              style={{ border: "1px solid #515151" }}
            />

            <div className="flex mt-5 md:w-[250px] w-[180px]">
              <p className="text-[#00FF00] flex items-center gap-2">
                <InlineSVG src="/icons/profile-green.svg" className="w-4 h-4" />
                <span className="text-[10px] md:text-sm">Raghuvaran</span>
              </p>
            </div>

            <div className="mt-4 text-left space-y-4">
              <p className="text-white flex">
                <span className="text-[10px] md:text-sm md:w-[130px] w-[100px]">Total votes:</span>
                <span className="text-[#00FF00] text-[10px] md:text-sm">24</span>
              </p>
              <p className="text-white flex">
                <span className="text-[10px] md:text-sm md:w-[130px] w-[100px]">Total Upvotes:</span>
                <span className="text-[#00FF00] text-[10px] md:text-sm">48</span>
              </p>
              <p className="text-white flex">
                <span className="text-[10px] md:text-sm md:w-[130px] w-[100px]">Date of Battle:</span>
                <span className="text-[#00FF00] text-[10px] md:text-sm">
                  12 October 2024
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="previous-btn-Wrapper">
            <button className="previous-btn text-[#FDEA60] font-light md:text-[15px] text-[10px] ">
              {" "}
              Unique Rare Winner:{" "}
              <span className="text-[#00FF00]  font-light">Karthik</span>
            </button>

            <div className="previous-btn-Border" />

            <div className="previous-btn-Overlay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousArtPopup;
