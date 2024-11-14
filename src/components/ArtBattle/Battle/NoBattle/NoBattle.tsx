"use client";

import { useAuth } from "@/contexts/AuthContext";

export const NoBattle: React.FC = () => {
    const { user } = useAuth();
    let userDetails = user;
    return (
        <div className="flex w-full justify-center mt-5">
            <div className="mt-4 mx-8 flex justify-center h-[29rem]">
                <div
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
                </div>
            </div>
        </div>
    )
}