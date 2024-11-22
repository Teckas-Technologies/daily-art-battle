import { uploadReference } from "@mintbase-js/storage";
import { useContext, useState } from "react";
import { NearContext, Wallet } from "@/wallet/WalletSelector";
import { ART_BATTLE_CONTRACT, ART_BATTLE_PROXY_CONTRACT, NEXT_PUBLIC_PROXY_ADDRESS } from "@/config/constants";
import { fetchWithAuth } from "../../utils/authToken";

type mintObj = {
  title: string;
  mediaUrl: string;
  referenceUrl:string;
  count:number;
  contractId:string;
};
 
const useMintImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { wallet, signedAccountId } = useContext(NearContext);

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
        callbackUrl: window.location.origin + "/profile",
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

  const burnNft = async (
    tokenId:any
  ) => {
    if (!wallet) {
      throw new Error("Wallet is not defined.");
    }

    try {
      const res = await wallet.callMethod({
        contractId: NEXT_PUBLIC_PROXY_ADDRESS,
        method: 'nft_batch_burn',  // Assuming 'burn' is the method in your contract to burn the NFT
        args: {
          nft_contract_id: ART_BATTLE_CONTRACT,
          token_id: tokenId,  // Token ID to burn
        },
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
      const res = await fetchWithAuth(`/api/gfxCoin?queryType=mint&transactionHash=${transactionHash}`, {
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
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`/api/gfxCoin?transactionHash=${transactionHash}`);
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
  return { mintImage,burnNft,saveHash,getHash,loading, error };
};

export default useMintImage;
