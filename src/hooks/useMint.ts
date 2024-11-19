import { uploadReference } from "@mintbase-js/storage";
import { useContext, useState } from "react";
import { NearContext, Wallet } from "@/wallet/WalletSelector";
import { ART_BATTLE_CONTRACT, ART_BATTLE_PROXY_CONTRACT, NEXT_PUBLIC_PROXY_ADDRESS } from "@/config/constants";

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
        method: 'nft_burn',  // Assuming 'burn' is the method in your contract to burn the NFT
        args: {
          nft_contract_id: ART_BATTLE_CONTRACT,
          token_id: tokenId,  // Token ID to burn
        },
        gas: '200000000000000', 
        deposit: '0'  // No deposit needed for burning NFTs
      });
      console.log("Ress 1 >>> ", res);
      return res;
    } catch (error) {
      console.error("Failed to sign and send transaction:", error);
      // throw new Error("Failed to sign and send transaction");
    }
  };
  return { mintImage,burnNft, loading, error };
};

export default useMintImage;
