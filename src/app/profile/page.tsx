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
import { GFX_CAMPAIGNID } from "@/config/constants";
import React, { useContext, useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import DailyCheckin from "@/components/Profile Page/DailyCheckin/DailyCheckin";
import { MintBurnPopup } from "@/components/PopUps/MintBurnPopup";
import { ConfirmPopupInfo } from "@/types/types";
import useNearTransfer from "@/hooks/nearTransferHook";
import { NearContext } from "@/wallet/WalletSelector";
import { getTxnStatus } from "@mintbase-js/rpc";
import Toast from "@/components/Toast";
const page = () => {
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { postNearTransfer, getNearTransfer } = useNearTransfer();
  const { wallet, signedAccountId } = useContext(NearContext);
  const [confirmPopup, setConfirmPopup] = useState<ConfirmPopupInfo>({
    info: "",
    text: "",
    isMint: false
  });

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
      const searchParams = new URLSearchParams(window.location.search);

      const accountId = searchParams.get("account_id") || "";
      const txnHash = searchParams.get("transactionHashes") || "";

      console.log("Wallet Address (Account ID):", accountId);
      console.log("Transaction Hash:", txnHash);

      if (signedAccountId) {
        try {
          if (txnHash) {
            const existingTxn = await getNearTransfer(txnHash);
            if (existingTxn) {
              console.log("Transaction hash already exists in the database.");
            } else {
              const senderId = accountId;
              const rpcUrl = "https://rpc.testnet.near.org";
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
              } else {
                setToastMessage(`Transaction Failed!`);
                setSuccessToast("no");
                setToast(true);
              }
            }
          }
        } catch (error) {
          console.error("Error in fetchTransaction:", error);
          setToastMessage(`Transaction Failed!`);
          setSuccessToast("no");
          setToast(true);
        }
      } else {
        console.log("No transaction hash found in the URL.");
      }
    };

    fetchTransaction();
  }, [signedAccountId]);

      const closeMintBurnPopup = () => {
        setConfirmPopup({ info: "", text: "", isMint: false })
      }
      
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
      />
      <ProfilePath />
      <ProfileHeader
        onEditClick={handleEditClick}
        handleCoinClick={handleCoinClick}
      />
      <DailyCheckin />
      <ProfileBody setConfirmPopup={setConfirmPopup} />
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
      {confirmPopup.info !== "" && <MintBurnPopup info={confirmPopup?.info} text={confirmPopup?.text} isMint={confirmPopup?.isMint} onClose={() => closeMintBurnPopup()} />}
    </main>
  );
};


export default page;
