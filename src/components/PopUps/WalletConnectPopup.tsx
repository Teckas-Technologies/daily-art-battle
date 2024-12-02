"use client";

import { useAuth } from "@/contexts/AuthContext";
// import InlineSVG from "react-inlinesvg";
import "./Popup.css";
import { useContext } from "react";
import { NearContext } from "@/wallet/WalletSelector";
import InlineSVG from "react-inlinesvg";

interface Props {
  onClose: () => void;
}

export const WalletConnectPopup: React.FC<Props> = ({ onClose }) => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const { signInUser, user } = useAuth();
  let userDetails = user;

  const handleSignIn = async () => {
    handleSignOut();
    await wallet?.signIn();
  };

  const handleSignOut = async () => {
    await wallet?.signOut();
  };

  const clickCancel = async () => {
    handleSignOut();
    await wallet?.signIn();
    onClose();
  };
  return (
    <div className="sign-in-popup fixed top-0 z-50 w-full h-full flex items-center justify-center px-3">
      <div className="signin-card w-[25.5rem] h-auto lg:p-8 md:p-6 p-4 rounded-2xl bg-black">
        <div className="close-art w-full flex justify-end">
          <div
            className="close-icon w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-md cursor-pointer"
            onClick={clickCancel}
          >
            <InlineSVG
              src="/icons/close.svg"
              className="md:w-4 md:h-4 w-3 h-3 spartan-light"
            />
          </div>
        </div>
        <h6 className="text-center text-sm leading-tight font-light py-2">
          Connect your {userDetails?.user?.nearAddress} wallet!
        </h6>
        <h2 className="text-green font-bold text-xl text-center pt-3 pb-4 md:px-0 px-10">
          Connect the correct NEAR address
        </h2>
        <div className="popup-btns w-full flex justify-center items-center gap-3 py-1">
          {" "}
          {/** mb-5 */}
          {/* <div className="cancel-btn-new px-10 py-2 rounded-3xl cursor-pointer" onClick={onClose}>
                        <h2 className='font-semibold text-md'>Cancel</h2>
                    </div> */}
          <div className="popup-btns w-full flex justify-center items-center gap-3 py-1 mb-5">
            <div
              className="cancel-btn-new px-10 py-2 rounded-3xl cursor-pointer"
              onClick={clickCancel}
            >
              <h2 className="font-semibold text-md">Cancel</h2>
            </div>
            <div className="signin-outer w-auto rounded-3xl cursor-pointer">
              <div
                className="signin-btn px-10 py-2 rounded-3xl cursor-pointer"
                onClick={handleSignIn}
              >
                <h2>Connect</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
