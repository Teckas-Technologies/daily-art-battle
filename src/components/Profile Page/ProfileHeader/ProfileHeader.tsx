import React from 'react'
import InlineSVG from 'react-inlinesvg'
import './ProfileHeader.css'
interface ProfileHeaderProps {
  onEditClick: () => void;
}
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick }) => {
  return (
    <div className="profile-header">
        <div className="profile-bg flex items-center lg: justify-center gap-[40px] bg-[#000000] text-white rounded-xl h-[200px] px-8 py-10 xl: h-[250px] w-[500px]">
          <div className="flex lg: items-center gap-3">
            <img
              src="/images/profile.png"
              alt="Profile Picture"
              className="rounded-lg lg: w-[80px] h-[80px] xl: w-[100px] h-[100px]"
            />
            <div>
              <h2 className="lg: text-base font-semibold xl: text-lg">
                Uppalapati Prabhas Raju
              </h2>
              <p className="text-[#818181] lg: text-xs font-light">
                prabhasraju23@gmail.com
              </p>
              <div className="flex lg: gap-4 mt-2 xl: gap-1 mt-2">
                <button
                  className="rounded-full lg: text-xs bg-transparent edit-profile-btn text-[8px] font-semibold py-[7px] px-[30px] xl: text-[11px] px-[25px]"
                  style={{ border: "0.75px solid #00FF00" }}
                  onClick={onEditClick}
                >
                  Edit Profile
                </button>
                <button className="bg-[#7A7A7A] rounded-full buy-coin-btn lg: text-xs text-[8px] font-semibold py-[7px] px-[30px] xl: text-[11px] px-[25px]">
                  Buy Coins
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center rounded-xl border border-yellow-600 text-center lg: justify-center p-3 xl: px-4">
            <div className="flex flex-col items-center lg: justify-center gap-[3px] xl: gap-[7px]">
              {/* <div className="flex justify-center mb-2"></div> */}
              <h3 className="flex items-center lg: text-lg font-semibold flex-row justify-center gap-1 xl: gap-2 text-xl">
                {" "}
                <InlineSVG
                  src="/icons/coin.svg"
                  className="lg: w-[40px] h-[40px] xl: w-[45px] h-[45px]"
                />
                GFXvs
              </h3>
              <p className="lg: text-2xl font-bold xl: text-3xl">2000</p>
            </div>
          </div>

          <div className="flex lg: flex-col items-center w-[200px] xl: w-[220px]">
            <p className="flex flex-row items-center justify-center gap-5 text-white text-xs font-semibold xl: font-sm">
              Referral Link{" "}
              <span className="gfx-text flex flex-row items-center justify-center gap-1 font-semibold text-xs">
                100 GFXvs <InlineSVG src="/icons/coin.svg" />
              </span>
            </p>
            <div className="flex items-center lg: gap-2 mt-2 ">
              <p className="bg-transparent py-1 text-sm  text-xs font-extralight">
                https://gfxvs/refe........
              </p>
              <div className="flex flex -row items-center justify-center gap-1">
                <InlineSVG src="/icons/copy-green.svg" />

                <InlineSVG src="/icons/share.svg" />
              </div>
            </div>
            <button
              className="flex items-center bg-transparent rounded-full text-[#FFFFFF] lg: justify-center gap-2 px-9 py-2 mt-4 text-xs font-light w-[180px] xl: w-[190px]"
              style={{ border: "0.75px solid #00FF00" }}
            >
              <InlineSVG
                src="/icons/tele-green.svg"
                className="lg: w-[15px] h-[15px]"
              />
              Connect
            </button>
          </div>

          <button className="flex items-center text-[#FFFFFF] lg: px-6 py-[10px] rounded-full ml-8 text-xs connect-button xl: ml-0 py-[13px] ">
            Connect Wallet
            <InlineSVG src="/icons/side-arrow.svg" />
          </button>
        </div>
      </div>
  )
}

export default ProfileHeader