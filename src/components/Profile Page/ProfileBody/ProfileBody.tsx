import { useState } from "react";
import { UploadedArtsGrid } from "./UploadedArtsGrid/UploadedArtsGrid";

const tabs = [
    { id: "uploads", label: "Uploads", active: true },
    { id: "collects", label: "Collects", active: false },
    { id: "wallet", label: "Wallet History", active: false }
]

export const ProfileBody: React.FC = () => {
    const [activeTab, setActiveTab] = useState("uploads");

    return (
        <div className="profile-body w-full xl:px-[7rem] lg:px-[3rem] md:px-[2rem] px-3 mt-10">
            <div className="tabs w-full max-w-[800px] flex items-center justify-center gap-4">
                {tabs.map((tab) => (
                    <div
                        key={tab?.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab cursor-pointer spartan-semibold text-center md:text-md text-sm ${tab.id !== tabs[0].id && ""} md:w-[16rem] w-[10rem] py-2 rounded-tl-[15px] rounded-tr-[45px] rounded-bl-0 rounded-br-[45px] border-t-[0.75px] border-r-[0.75px] font-medium tracking-[-0.06em] ${activeTab === tab.id ? 'border-[#00FF00] text-[#00FF00]' : 'border-[#888888] text-[#FFFFFF]'} bg-transparent relative z-[1]`}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <UploadedArtsGrid />
        </div>
    )
}