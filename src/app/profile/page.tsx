"use client";
import CampaignSuccess from "@/components/Campaign page/Campaign Success/CampaignSuccess";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import CoinPurchasePopup from "@/components/Profile Page/BuyCoins Popup/BuyCoins";
import EditProfilePopup from "@/components/Profile Page/EditProfile Popup/EditProfilePopup";
import ProfilePath from "@/components/Profile Page/Profile Path/ProfilePath";
import { ProfileBody } from "@/components/Profile Page/ProfileBody/ProfileBody";
import { MobileNav } from "@/components/MobileNav/MobileNav";
import ProfileHeader from "@/components/Profile Page/ProfileHeader/ProfileHeader";
import { GFX_CAMPAIGNID, NEXT_PUBLIC_NETWORK } from "@/config/constants";
import React, { useContext, useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import DailyCheckin from "@/components/Profile Page/DailyCheckin/DailyCheckin";
import { getFromLocalStorage, MintBurnPopup, saveToLocalStorage } from "@/components/PopUps/MintBurnPopup";
import { ConfirmPopupInfo } from "@/types/types";
import useNearTransfer from "@/hooks/nearTransferHook";
import { NearContext } from "@/wallet/WalletSelector";
import { getTxnStatus } from "@mintbase-js/rpc";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { useAuth } from "@/contexts/AuthContext";
import useMintImage from "@/hooks/useMint";
import { useArtsRaffleCount } from "@/hooks/useRaffleTickets";
const page = () => {
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [coin, setCoin] = useState<number | undefined>(undefined);
  const [buyCoin, setBuyCoin] = useState("");
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [walltMisMatchPopup, setWalletMismatchPopup] = useState(false);
  const { postNearTransfer, getNearTransfer } = useNearTransfer();
  const { wallet, signedAccountId } = useContext(NearContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [burnSuccess, setBurnSuccess] = useState(false);

  const { user } = useAuth();
  let userDetails = user;
  useEffect(() => {
    setCoin(userDetails?.user?.gfxCoin);
    console.log("coin >>>>>>>>>>>>>>>>>", coin);
  }, [coin, userDetails]);

  const { getHash, saveHash } = useMintImage();
  const { updateRaffleMint } = useArtsRaffleCount();

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
    if (toastMessage) {
      setTimeout(() => setToastMessage(""), 3000);
    }

  }, [toast, toastMessage]);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };
  const handleCoinClick = () => {
    setIsCoinOpen(true);
  };
  const closeCoinModal = () => {
    setIsCoinOpen(false);
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      // const searchParams = new URLSearchParams(window.location.search);

      const accountId = searchParams?.get("account_id") || "";
      const txnHash = searchParams?.get("transactionHashes") || "";
      const isMint = searchParams?.get('isMint') || "";
      const isNeartransfer = searchParams?.get('isNeartransfer') || "";
      const isUsdttransfer = searchParams?.get('isUsdttransfer') || "";
      const artId = searchParams?.get('artId') || "";
      const queryType = searchParams?.get('queryType') || "";

      if (signedAccountId) {
        if (isMint) {
          try {
            if (txnHash) {
              const notExist = await getHash(txnHash);
              console.log("NOT Exist:", notExist)
              if (notExist) {
                const senderId = accountId;
                const rpcUrl = `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org`;
                const txnStatus = await getTxnStatus(txnHash, senderId, rpcUrl);

                if (txnStatus === "success") {
                  setToastMessage(`Minting Successful!`);
                  setSuccessToast("yes");
                  setToast(true);
                  await updateRaffleMint(artId, queryType);
                  await saveHash(txnHash);
                  window.history.replaceState(null, '', "/profile");
                } else {
                  setToastMessage(`Minting Failed!`);
                  setSuccessToast("no");
                  setToast(true);
                  window.history.replaceState(null, '', "/profile");
                }
              } else {
                console.log("Transaction hash already exists in the database.");
              }
            }
          } catch (error) {
            setToastMessage(`Minting Failed!`);
            setSuccessToast("no");
            setToast(true);
          }
        } else if (isNeartransfer) {
          console.log("IS MINT3:", isMint)
          try {
            if (txnHash) {
              const existingTxn = await getNearTransfer(txnHash);
              if (existingTxn) {
                console.log("Transaction hash already exists in the database.");
              } else {
                const senderId = accountId;
                const rpcUrl = `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org`;
                const txnStatus = await getTxnStatus(txnHash, senderId, rpcUrl);
                console.log("Transaction Status:", txnStatus);

                if (txnStatus === "success") {
                  console.log("Storing ID and transaction hash...");
                  console.log("Active Account ID:", accountId);
                  console.log("Transaction Hash:", txnHash);
                  await postNearTransfer(accountId, txnHash);

                  setToastMessage(`Transaction Successful!`);
                  setSuccessToast("yes");
                  setToast(true);
                  window.history.replaceState(null, '', "/profile");
                } else {
                  setToastMessage(`Transaction Failed!`);
                  setSuccessToast("no");
                  setToast(true);
                  window.history.replaceState(null, '', "/profile");
                }
              }
            }
          } catch (error) {
            console.error("Error in fetchTransaction:", error);
            setToastMessage(`Transaction Failed!`);
            setSuccessToast("no");
            setToast(true);
          }
        }
      } else {
        console.log("IS MINT4:", isMint)
        console.log("No transaction hash found in the URL.");
      }
    };

    if (signedAccountId) {
      fetchTransaction();
    }
  }, [signedAccountId, userDetails, searchParams, pathName]);

  const isArtBurn = getFromLocalStorage("isArtBurn")
  useEffect(() => {
    if (userDetails) {
      // const searchParamsNew = new URLSearchParams(window.location.search);
      // const isArtBurn = searchParams?.get("isArtBurn") || "";
      if (isArtBurn !== "null") {
        if (isArtBurn === "success") {
          setToastMessage(`Burn Successful!`);
          setSuccessToast("yes");
          setToast(true);
          saveToLocalStorage("isArtBurn", "null");
          // window.history.replaceState(null, '', "/profile");
        } else if (isArtBurn === "failed") {
          setToastMessage(`Burn Failed!`);
          setSuccessToast("no");
          setToast(true);
          saveToLocalStorage("isArtBurn", "null");
          // window.history.replaceState(null, '', "/profile");
        }
      }
    }
  }, [searchParams, pathName, userDetails, isArtBurn])

  useEffect(() => {
    const buycoin = searchParams?.get("buyCoin");
    // console.log("BuyCoin Query Parameter:", buycoin);
    if (buycoin) {
      setIsCoinOpen(true);
      // console.log("isCoinOpen set to true");
    }
  }, [searchParams, pathName, userDetails]);
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
    <main
      className="relative flex flex-col w-full justify-center overflow-x-hidden bg-black min-h-[100vh] px-3 md:px-[2rem] lg:px-[3rem] xl:px-[7rem] xxl:px-[9rem]"
      style={{
        backgroundPosition: "top",
        backgroundSize: "cover",
        overflowX: "hidden",
        overflowY: "scroll",
      }}
    >
      <Header
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
        setWalletMismatchPopup={setWalletMismatchPopup}
      />
      <ProfilePath />
      <ProfileHeader
        onEditClick={handleEditClick}
        handleCoinClick={handleCoinClick}
        coin={coin ?? 0}
      />
      <DailyCheckin coin={coin ?? 0} />
      <ProfileBody />
      <FooterMenu
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
      />
      <MobileNav
        openNav={openNav}
        setOpenNav={setOpenNav}
        fontColor={""}
        campaignId={GFX_CAMPAIGNID}
        toggleUploadModal={toggleUploadModal}
        uploadSuccess={uploadSuccess}
        setSignToast={setSignToast}
        setErrMsg={setErrMsg}
      />
      {isEditOpen && <EditProfilePopup onClose={closeEditModal} />}
      {isCoinOpen && <CoinPurchasePopup onClose={closeCoinModal} />}
      {toast && toastMessage && (
        <div
          className="fixed top-10 mt-20 xl:right-[-72%] lg:right-[-67%] md:right-[-55%] right-[-9.3%] w-full h-full overflow-hidden"
          style={{ zIndex: 55 }}
        >
          <div className="relative w-full h-full">
            <Toast
              success={successToast === "yes" ? true : false}
              message={toastMessage}
              onClose={() => {
                setToast(false);
                setToastMessage("");
                setSuccessToast("");
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default page;
