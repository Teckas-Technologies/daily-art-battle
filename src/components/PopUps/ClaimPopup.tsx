"use client";

import { useAuth } from "@/contexts/AuthContext";
import InlineSVG from "react-inlinesvg";
import "./Popup.css";

interface Props {
  onClose: () => void;
  msg: string;
  toggleUploadModal: () => void;
}

export const ClaimPopup: React.FC<Props> = ({ onClose, msg,toggleUploadModal }) => {
  const { signInUser } = useAuth();
  const uploadArt = ()=>{
    onClose();
    toggleUploadModal();
  }
  return (
    <div className="sign-in-popup fixed top-0 z-50 w-full h-full flex items-center justify-center px-3">
      <div className="signin-card w-[25rem] h-auto lg:p-8 md:p-6 p-4 rounded-2xl bg-black">
        <div className="close-art w-full flex justify-end">
          <div
            className="close-icon w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-md cursor-pointer"
            onClick={onClose}
          >
            <InlineSVG
              src="/icons/close.svg"
              className="md:w-4 md:h-4 w-3 h-3 spartan-light"
            />
          </div>
        </div>

        <h4 className="text-green font-bold text-lg text-center py-3">{msg}</h4>
        <div className="popup-btns w-full flex justify-center items-center gap-3 py-1 mb-5">
          <div
            className="cancel-btn-new px-10 py-2 rounded-3xl cursor-pointer"
            onClick={uploadArt}
          >
            <h2 className="font-semibold text-md">Upload Art</h2>
          </div>
         
        </div>
      </div>
    </div>
  );
};
