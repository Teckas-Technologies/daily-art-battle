"use client";

import { useAuth } from "@/contexts/AuthContext";
import "./NoBattle.css"
import { useState } from "react";
import { SignInPopup } from "@/components/PopUps/SignInPopup";

interface Props {
    toggleUploadModal: () => void;
}

export const NoBattle: React.FC<Props> = ({ toggleUploadModal }) => {
    const [signToast, setSignToast] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [infoMsg, setInfoMsg] = useState("");
    const { user } = useAuth();
    let userDetails = user;

    const handleUpload = () => {
        if (!userDetails) {
            setSignToast(true);
            setErrMsg("Sign In to upload your Art!");
            return;
        }

        if (userDetails) {
            toggleUploadModal();
        }
    }

    return (
        <div className="flex w-full justify-center mt-5">
            <div className="mt-4 md:mx-8 mx-0 flex flex-col justify-start items-center gap-6 md:pt-20 pt-10 h-[20rem] w-full xxl:px-[25rem] xl:px-[20rem] lg:px-[15rem] md:px-[10rem] px-0">

                <h2 className="text-[1.5rem] font-semibold leading-[2rem] text-center">Want to show your Talent? Upload your own masterpiece and join the competition!</h2>

                <div className="currentButtonWrapper">
                    <button className="currentbtn" onClick={handleUpload}>
                        Upload Art
                    </button>

                    <div className="currentButtonBorder" />

                    <div className="currentButtonOverlay" />
                </div>

                {/* <div
                    className="no-battle flex mt-5"
                    style={{
                        width: 300,
                        height: 200,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        borderRadius: 8,
                    }}
                >
                    <h2 style={{ color: "#000", fontWeight: 600, fontSize: 18 }}>
                        No Battles Today!
                    </h2>
                    <p className="px-5" style={{ color: "#000", textAlign: "justify" }}>
                        To start your battle by clicking the "Add Artwork" Button.
                    </p>
                    <div className="add-art-btn mt-5 text-center">
                        <button
                            // onClick={toggleUploadModal}
                            disabled={!userDetails?.user}
                            className={`px-4 py-2 vote-btn text-white bg-gray-900 rounded ${!userDetails?.user ? "cursor-not-allowed" : ""}`}
                        >
                            Add Artwork
                        </button>
                    </div>
                </div> */}
            </div>
            {signToast && <SignInPopup text={errMsg} infoMsg={infoMsg} onClose={() => setSignToast(false)} />}
        </div>
    )
}