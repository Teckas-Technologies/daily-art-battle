import { useEffect, useState } from "react";
import { UploadedArtsGrid } from "./UploadedArtsGrid/UploadedArtsGrid";
import { Collections } from "./Collections/Collections";
import WalletHistory from "./WalletHistory/WalletHistory";
import { usePathname, useSearchParams } from "next/navigation";

const tabs = [
  { id: "uploads", label: "Uploads", active: true },
  { id: "collects", label: "Collections", active: false },
  { id: "wallet", label: "Wallet History", active: false },
];
interface Props {
  setBurnArtSuccess: (e: boolean) => void;
  setBurnArtFailed: (e: boolean) => void;
  burnArtSuccess: boolean;
}
export const ProfileBody: React.FC<Props> = ({
  burnArtSuccess,
  setBurnArtSuccess,
  setBurnArtFailed,
}) => {
  const [activeTab, setActiveTab] = useState("uploads");
  const [rendered, setRendered] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();

  useEffect(() => {
    setRendered(!rendered);
  }, [activeTab]);

  useEffect(() => {
    const walletHistory = searchParams?.get("walletHistory");
    if (walletHistory) {
      handleTabClick("wallet");
    }
  }, [searchParams, pathName]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);

    // Scroll to the top of the `profile-body` element with an extra 16px offset
    const profileBodyElement = document.getElementById("profile-body");
    if (profileBodyElement) {
      const offset = -130; // Move 16px above the element
      const elementPosition =
        profileBodyElement.getBoundingClientRect().top + window.pageYOffset;
      const scrollToPosition = elementPosition + offset;

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div id="content-top"></div>

      <div className="profile-body w-full mt-10" id="profile-body">
        <div className="tabs w-full md:max-w-[800px] flex flex-wrap items-center justify-center gap-4">
          <div className="tabs w-full md:max-w-[800px] md:grid-cols-3 grid grid-cols-2 gap-x-4 gap-y-4">
            {tabs.map((tab) => (
              <div
                key={tab?.id}
                onClick={() => handleTabClick(tab.id)}
                className={`tab cursor-pointer spartan-semibold text-center md:text-md text-xs 
        md:w-[16rem] w-full md:py-3 py-2 rounded-tl-[15px] rounded-tr-[45px] rounded-bl-0 rounded-br-[45px] 
        border-t-[0.75px] border-r-[0.75px] font-medium tracking-[-0.06em] 
        ${
          activeTab === tab.id
            ? "border-[#00FF00] text-[#00FF00]"
            : "border-[#888888] text-[#FFFFFF]"
        } 
        bg-transparent relative z-[1]`}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        {activeTab === "uploads" && <UploadedArtsGrid rendered={rendered} />}
        {activeTab === "collects" && (
          <Collections
            burnArtSuccess={burnArtSuccess}
            setBurnArtFailed={setBurnArtFailed}
            setBurnArtSuccess={setBurnArtSuccess}
          />
        )}
        {activeTab === "wallet" && <WalletHistory rendered={rendered} />}
      </div>
    </>
  );
};
