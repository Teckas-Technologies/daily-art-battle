import React from "react";
import InlineSVG from "react-inlinesvg";

interface EditProfilePopupProps {
  onClose: () => void;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="w-[90%] md:w-[600px] bg-[#000000] rounded-2xl px-[20px] md:px-[40px] py-[20px] md:py-[40px] text-white relative"
        style={{ border: "1px solid #383838" }}
      >
        <button className="absolute top-4 right-4" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" className="w-6 h-6 " />
        </button>

        <h2 className="text-center text-sm font-medium text-[#00FF00] mb-[40px] md:mb-[30px] md:text-xl md:font-semibold mt-[20px] md:mt-0">
          Edit Profile Details
        </h2>

        <form className="space-y-3 md:space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 rounded-full border bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="mailid"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Mail id
            </label>
            <input
              type="text"
              id="mailid"
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="twitter"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="instagram"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="telegram"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Telegram
            </label>
            <input
              type="text"
              id="telegram"
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="facebook"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-row items-center justify-center gap-5 mt-4 md:mt-0 ">
            <button
              type="button"
              className="w-full md:w-auto px-4 md:px-8 py-3 md:py-3 rounded-full font-semibold text-[#00FF00] text-xs md:text-base"
              onClick={onClose}
              style={{ border: "0.61px solid #00FF00" }}
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="w-full md:w-auto px-4 md:px-8 py-3 md:py-3 rounded-full font-semibold bg-[#AAAAAA] text-[#FFFFFF] text-xs md:text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
