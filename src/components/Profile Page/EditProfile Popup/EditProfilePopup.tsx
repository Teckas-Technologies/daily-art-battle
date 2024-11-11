import React from "react";
import InlineSVG from "react-inlinesvg";

interface EditProfilePopupProps {
  onClose: () => void;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({ onClose }) => {
  return (
   
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-[600px] bg-[#000000] rounded-2xl px-[60px] py-[40px] text-white relative" style={{ border: "1px solid #383838" }}>
        <button className="absolute top-4 right-4" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" className="w-6 h-6" />
        </button>

        <h2 className="text-center text-xl font-semibold text-[#00FF00] mb-[50px]">
          Edit Profile Details
        </h2>

        <form className="space-y-4">
          <div className="flex flex-row items-center">
            <label htmlFor="username" className="text-sm font-semibold mb-1 w-[230px]">Username</label>
            <input type="text" id="username" className="w-full px-4 py-2 rounded-full border bg-transparent text-white focus:outline-none"  style={{border: "0.61px solid #B5B5B5"}}/>
          </div>

          <div className="flex flex-row items-center">
            <label htmlFor="mailid" className="text-sm font-semibold mb-1 w-[230px]">Mail id</label>
            <input type="text" id="mailid" className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"  style={{border: "0.61px solid #B5B5B5"}} />
          </div>

          <div className="flex flex-row items-center">
            <label htmlFor="twitter" className="text-sm font-semibold mb-1 w-[230px]">Twitter</label>
            <input type="text" id="twitter" className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"  style={{border: "0.61px solid #B5B5B5"}}/>
          </div>

          <div className="flex flex-row items-center">
            <label htmlFor="instagram" className="text-sm font-semibold mb-1 w-[230px]">Instagram</label>
            <input type="text" id="instagram" className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"  style={{border: "0.61px solid #B5B5B5"}} />
          </div>

          <div className="flex flex-row items-center">
            <label htmlFor="telegram" className="text-sm font-semibold mb-1 w-[230px]">Telegram</label>
            <input type="text" id="telegram" className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"  style={{border: "0.61px solid #B5B5B5"}} />
          </div>

          <div className="flex flex-row items-center">
            <label htmlFor="facebook" className="text-sm font-semibold mb-1 w-[230px]">Facebook</label>
            <input type="text" id="facebook" className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"  style={{border: "0.61px solid #B5B5B5"}}/>
          </div>

          <div className="flex items-center justify-center gap-5 mt-6">
            <button
              type="button"
              className="px-8 py-3 rounded-full font-semibold text-[#00FF00]"
              onClick={onClose}
              style={{border: "0.61px solid #00FF00"}}
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="px-8 py-3 rounded-full font-semibold bg-[#AAAAAA] text-[#FFFFFF]"
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
