import React, { useContext, useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import "./ProfileHeader.css";
import { NearContext } from "@/wallet/WalletSelector";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL } from "@/config/constants";
import useUpdateUserProfile from "@/hooks/updateProfileHook";
import Toast from "@/components/Toast";
import { uploadFile } from "@mintbase-js/storage";

interface ProfileHeaderProps {
  onEditClick: () => void;
  handleCoinClick: () => void;
  coin: number;
}
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onEditClick,
  handleCoinClick,
  coin,
}) => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { user } = useAuth();
  let userDetails = user;
  const { updateUserProfile, isLoading, error } = useUpdateUserProfile();
  const [profileImg, setProfileImg] = useState<string>(
    user?.user?.profileImg || "/images/User_New.png"
  );
  const referralLink = `${BASE_URL}/${userDetails?.user?.referralCode}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(() => {
        // console.log("Failed to copy!");
      });
  };
  const handleSignIn = async () => {
    // console.log("clicked login");
    return wallet?.signIn();
  };
  useEffect(() => {
    if (user?.user?.profileImg) {
      setIsImageLoading(true);
      const image = new Image();
      image.src = user.user.profileImg;
      image.onload = () => {
        setProfileImg(user.user.profileImg);
        setIsImageLoading(false);
      };
      image.onerror = () => {
        setProfileImg("/images/no-profile.png");
        setIsImageLoading(false);
      };
    } else {
      setIsImageLoading(false);
    }
  }, [user?.user?.profileImg]);

  const MAX_FILE_SIZE_MB = 40;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setToastMessage(
          `File size exceeds ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`
        );
        setSuccessToast("no");
        setToast(true);
        return;
      }

      try {
        const uploadResult = await uploadFile(file);
        const arweaveUrl = `https://arweave.net/${uploadResult.id}`;

        const updatedProfile = await updateUserProfile({
          profileImg: arweaveUrl,
        });

        if (updatedProfile) {
          setProfileImg(arweaveUrl);
          setToastMessage("Profile image updated successfully!");
          setSuccessToast("yes");
          setToast(true);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setToastMessage("Failed to update profile. Please try again.");
        setSuccessToast("no");
        setToast(true);
      }
    }
  };
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => {
        setToast(false);
        setToastMessage("");
        setSuccessToast("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [toast]);
  return (
    <div className="profile-header">
      <div className="profile-bg flex items-center justify-center flex-col px-[20px] py-4 bg-[#000000] text-white h-[350px] rounded-xl md:flex-row md:justify-between md:h-[230px] lg:flex-row lg:justify-between lg:gap-[40px] lg:w-[100%] lg:h-[200px] lg:px-6 lg:py-10 xl:flex-row xl:justify-between xl:gap-[40px] xl:w-[100%] xl:px-7 xl:py-10 xxl:flex-row xxl:h-[250px]">
        <div className="flex mb-6 md:mb-0 lg:items-center gap-3 profile-img">
          <div className="profile-img relative flex items-center gap-3">
            <div
              className="relative md:w-[90px] w-[105px] md:h-[90px] h-[105px] lg:w-[90px] lg:h-[90px] xl:h-[90px] xl:w-[90px] xxl:h-[120px] xxl:w-[120px] rounded-lg"
              style={{ border: "1px solid #bbbbbb33" }}
            >
              {isImageLoading || isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <span className="loader"></span>
                </div>
              ) : (
                <img
                  alt="Profile Picture"
                  src={profileImg}
                  className="relative rounded-lg w-full h-full object-cover"
                />
              )}
            </div>

            <div className="absolute top-[5px] right-[5px] p-[2px] cursor-pointer bg-white border border-gray-500 rounded-full shadow-sm">
              <InlineSVG
                src="/icons/edit.svg"
                className="w-[12px] h-[12px]"
                style={{ fill: "gray" }}
                onClick={() => document.getElementById("fileInput")?.click()}
              />
            </div>

            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <h2 className="font-semibold text-[23px] lg:text-base xl:text-xl xxl:text-xl md:text-sm">
              {userDetails?.user?.firstName && userDetails?.user?.lastName
                ? `${userDetails.user.firstName} ${userDetails.user.lastName}`
                : "No Name"}
            </h2>
            <p className="text-[#818181] text-sm font-light lg:text-xs font-light xl:text-xs font-light xxl:text-base font-light md:text-[13px]">
              {userDetails?.user?.email ? userDetails.user.email : "No Email"}
            </p>

            <div className="flex mt-3 gap-2">
              <button
                className="rounded-full bg-transparent edit-profile-btn px-[20px] py-[10px] text-[10px] font-semibold md:text-[8px] md:px-[15px] md:py-[3px] lg:text-[8px] lg:py-[7px] lg:px-[10px] xl:text-[8px] xl:py-[7px] xl:px-[20px] xxl:text-[11px] xxl:py-[11px] xxl:px-[25px]"
                style={{ border: "0.75px solid #00FF00" }}
                onClick={onEditClick}
              >
                Edit Profile
              </button>
              <button
                className={`rounded-full buy-coin-btn px-[20px] py-[10px] text-[10px] font-light md:text-[8px] md:px-[15px] md:py-[1px] lg:text-[8px] lg:py-[7px] lg:px-[10px] xl:text-[8px] xl:py-[7px] xl:px-[20px] xxl:text-[11px] xxl:py-[11px] xxl:px-[25px] ${
                  signedAccountId
                    ? "buy-coin"
                    : "bg-[#7A7A7A] cursor-not-allowed"
                }`}
                onClick={handleCoinClick}
                disabled={!signedAccountId}
              >
                Buy Coins
              </button>
            </div>
          </div>
        </div>
        <div className="flex  md:hidden flex-row items-center justify-center gap-[20px]">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="gfx-div mobile">
              <div className="flex items-center rounded-xl text-center justify-center bg-[#000000] px-[20px] py-2">
                <div className="flex flex-col items-center gap-[5px]">
                  {/* <div className="flex justify-center mb-2"></div> */}
                  <h3 className="flex items-center flex-row justify-center font-semibold gap-1 text-base">
                    {" "}
                    <InlineSVG
                      src="/icons/coin.svg"
                      className="w-[30px] h-[30px]"
                    />
                    GFXvs
                  </h3>
                  <p className="font-bold text-2xl">
                    {userDetails?.user?.gfxCoin}
                  </p>
                </div>
              </div>
            </div>
            <div>
              {signedAccountId ? (
                <div className="flex flex-col items-center justify-between gap-2 button-div">
                  <p className="text-[#FFFFFF] text-xs font-semibold">
                    Wallet Address
                  </p>
                  <span
                    className="text-[#FFFFFF] text-[8px] font-light px-[18px] py-[5px] rounded-full"
                    style={{ border: "1px solid #00FF00" }}
                  >
                    {signedAccountId
                      ? signedAccountId.length > 20
                        ? `${signedAccountId.slice(0, 20)}...`
                        : signedAccountId
                      : ""}
                  </span>
                </div>
              ) : (
                <button
                  className="flex items-center text-[#FFFFFF] text-[10px] px-[10px] py-[8px] rounded-full connect-button"
                  onClick={handleSignIn}
                >
                  Connect Wallet
                  <InlineSVG src="/icons/side-arrow.svg" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col link-div">
            <p className="flex flex-row items-center justify-center gap-4 text-white text-[10px] font-semibold">
              Referral Link{" "}
              <span className="gfx-text flex flex-row items-center justify-center gap-1 text-[10px] font-semibold">
                100 GFXvs <InlineSVG src="/icons/coin.svg" />
              </span>
            </p>

            <div className="flex items-center gap-2 mt-2 ">
              <p className="bg-transparent py-1 text-xs font-extralight">
                {referralLink.length > 20
                  ? `${referralLink.slice(0, 20)}...`
                  : referralLink}
              </p>
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="flex flex-row items-center justify-center gap-1 copy-icon-container">
                  <InlineSVG
                    src="/icons/copy-green.svg"
                    onClick={handleCopy}
                    style={{ cursor: "pointer" }}
                  />
                  {showCopiedMessage && (
                    <span className="copied-toast">Copied!</span>
                  )}
                </div>

                <InlineSVG src="/icons/share.svg" />
              </div>
            </div>
            <button
              className="flex items-center bg-transparent justify-center text-xs font-light px-1 py-3 gap-2 rounded-full text-[#FFFFFF] mt-5 w-full"
              style={{ border: "0.75px solid #00FF00", marginTop: "10px" }}
              onClick={() => {
                window.location.href =
                  "https://t.me/GFXvs_Bot/GFXvs?startapp=command";
              }}
            >
              <InlineSVG
                src="/icons/tele-green.svg"
                className="w-[15px] h-[15px]"
              />
              Connect
            </button>
          </div>
        </div>

        {/* >>>>>>>>>>>>>>>>>>>>> */}

        <div className="hidden md:flex md:flex-row md:items-center md:justify-center md:gap-[20px] lg:gap-[20px] xl:gap-[50px] xxl:gap-[50px] md:mb-0">
          <div className="gfx-div">
            <div className="flex items-center rounded-xl text-center justify-center bg-[#000000] px-[7px] py-2 md:px-[15px] md:py-[5px] md:gap-[2px] lg:px-2 lg:py-2 xl:px-6 xl:py-3 xxl:px-6 xxl:py-3">
              <div className="flex flex-col items-center gap-[5px] lg:justify-center xl:gap-[1px] md:gap-[5px]">
                {/* <div className="flex justify-center mb-2"></div> */}
                <h3 className="flex items-center flex-row justify-center font-semibold gap-1 text-base lg:text-lg xl:text-lg xxl:text-2xl md:gap-[5px]">
                  {" "}
                  <img
                    src="/icons/coin.svg"
                    alt="Coin Icon"
                    className="w-[30px] h-[30px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] xl:w-[40px] xl:h-[40px] xxl:w-[50px] xxl:h-[50px]"
                  />
                  GFXvs
                </h3>
                <p className="font-bold text-2xl md:text-2xl lg:text-2xl xl:text-3xl xxl:text-4xl">
                  {userDetails?.user?.gfxCoin}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:items-center link-div">
            <p className="flex flex-row items-center gap-4 text-white text-xs font-semibold lg:text-xs xl:text-xs xxl:text-sm md:text-xs">
              Referral Link{" "}
              <span className="gfx-text flex flex-row items-center justify-center gap-1 text-xs font-semibold lg:text-xs xl:text-xs md:text-xs">
                100 GFXvs{" "}
                <img
                  src="/icons/coin.svg"
                  alt="Coin Icon"
                  className="w-[15px] h-[15px]"
                />
              </span>
            </p>

            <div className="flex items-center gap-2 mt-2 ">
              <p className="bg-transparent py-1 text-xs font-extralight lg:text-xs xl:text-xs xxl:text-sm md:text-xs">
                {referralLink.length > 20
                  ? `${referralLink.slice(0, 20)}...`
                  : referralLink}
              </p>
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="flex flex-row items-center justify-center gap-1 copy-icon-container">
                  <InlineSVG
                    src="/icons/copy-green.svg"
                    onClick={handleCopy}
                    style={{ cursor: "pointer" }}
                  />
                  {showCopiedMessage && (
                    <span className="copied-toast">Copied!</span>
                  )}
                </div>

                <InlineSVG src="/icons/share.svg" />
              </div>
            </div>
            <button
              className="flex items-center bg-transparent justify-center text-xs font-light px-9 py-2 gap-2 rounded-full text-[#FFFFFF] w-[100%] mt-1 lg:px-9 lg:py-2 lg:mt-4 lg:text-xs lg:font-light"
              style={{ border: "0.75px solid #00FF00" }}
              onClick={() => {
                window.location.href =
                  "https://t.me/GFXvs_Bot/GFXvs?startapp=command";
              }}
            >
              <InlineSVG
                src="/icons/tele-green.svg"
                className="w-[15px] h-[15px] lg:w-[15px] lg:h-[15px]"
              />
              Connect
            </button>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:justify-center">
          {signedAccountId ? (
            <div className="flex flex-col items-center justify-between gap-2 button-div">
              <p className="text-[#FFFFFF] text-sm font-semibold">
                Wallet Address
              </p>
              <span
                className="text-[#FFFFFF] text-xs font-light px-[30px] py-[5px] rounded-full"
                style={{ border: "1px solid #00FF00" }}
              >
                {signedAccountId
                  ? signedAccountId.length > 20
                    ? `${signedAccountId.slice(0, 20)}...`
                    : signedAccountId
                  : ""}
              </span>
            </div>
          ) : (
            <button
              className="flex items-center text-[#FFFFFF] text-xs px-[18px] py-[10px] rounded-full connect-button md:text-[8px] md:px-[18px] md:py-[10px] lg:px-6 lg:py-[10px] lg:text-xs xl:px-6 xl:py-[10px] xl:text-xs xxl:px-8 xxl:py-[13px] xxl:text-sm"
              onClick={handleSignIn}
            >
              Connect Wallet
              <InlineSVG src="/icons/side-arrow.svg" />
            </button>
          )}
          {toast && (
            <Toast
              success={successToast === "yes"}
              message={toastMessage}
              onClose={() => {
                setToast(false);
                setToastMessage("");
                setSuccessToast("");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
