import { uploadReference } from "@mintbase-js/storage";
import { useContext, useState } from "react";
import { NearContext, Wallet } from "@/wallet/WalletSelector";
import { ART_BATTLE_CONTRACT, ART_BATTLE_PROXY_CONTRACT, NEXT_PUBLIC_PROXY_ADDRESS } from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";

type mintObj = {
  title: string;
  mediaUrl: string;
  referenceUrl:string;
  count:number;
  contractId:string;
  artId: string;
  queryType: string;
};
 
const useMintImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { wallet, signedAccountId } = useContext(NearContext);
  const {
      user,
      userTrigger,
      setUserTrigger,
      newUser,
      setNewUser,
      nearDrop,
      setNearDrop,
    } = useAuth();

/**
 * This function is used for minting
 * @param data 
 * @returns 
 */
  const mintImage = async (
    data:mintObj
  ) => {
    if (!wallet) {
      throw new Error("Wallet is not defined.");
    }
 
    try {
      const metadata = { media:data.mediaUrl,reference: data.referenceUrl,title: data.title,copies:data.count };
      const res = await wallet.callMethod({
        contractId: NEXT_PUBLIC_PROXY_ADDRESS,
        callbackUrl: window.location.origin + `/profile?isMint=true&artId=${data.artId}&queryType=${data.queryType}`,
        method: 'mint',
        args: {
          metadata: JSON.stringify(metadata),   
          nft_contract_id:data.contractId,
        },
        gas: '200000000000000', 
        deposit: '10000000000000000000000'
      });
      console.log("Ress 1 >>> ", res);
      return res;
    } catch (error) {
      console.error("Failed to sign and send transaction:", error);
      // throw new Error("Failed to sign and send transaction");
    }
  };

  /**
   * This function is used for burning nft using token id
   * @param tokenId - used for burning nft
   * @returns 
   */
  const burnNft = async (
    tokenId:any
  ) => {
    if (!wallet) {
      throw new Error("Wallet is not defined.");
    }

    try {
      const res = await wallet.callMethod({
        contractId: NEXT_PUBLIC_PROXY_ADDRESS,
        method: 'nft_batch_burn',                  
        args: {
          token_ids: [tokenId],                       
        },
        gas: '300000000000000',                   
        deposit: "1"                              
      });
        
      
      console.log("Ress 1 >>> ", res);
      return res;
    } catch (error) {
      console.error("Failed to sign and send transaction:", error);
      // throw new Error("Failed to sign and send transaction");
    }
  };


  const saveHash = async(transactionHash:string)=>{
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gfxCoin?queryType=mint&transactionHash=${transactionHash}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(res.ok){
        return true;
      }  
    } catch (error:any) {
      console.log(error.message);
      setError(error.message);
      return false;
    }finally{
      setLoading(false);
    }
  }

  const getHash = async(transactionHash:string)=>{
    console.log("STEP 1")
    setLoading(true);
    setError(null);
    try {
      console.log("STEP 2")
      const res = await fetch(`/api/gfxCoin?transactionHash=${transactionHash}`);
      console.log("STEP 3")
      const data = await res.json();
      console.log("RES from API:", data)
      if(res.ok){
        if(data.message === "Hash not used"){
          return true;
        }
        if(data.message === "Hash already used") {
          return false;
        }
        
      }
    } catch (error:any) {
      console.log(error.message);
      console.log("STEP 4")
      setError(error.message);
      return false;
    }finally{
      setLoading(false);
    }
  }
  return { mintImage,burnNft,saveHash,getHash,loading, error };
};

export default useMintImage;
