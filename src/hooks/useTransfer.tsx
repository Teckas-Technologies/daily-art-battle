import { useContext, useState } from "react";
import "@near-wallet-selector/modal-ui/styles.css";
import * as nearAPI from "near-api-js";
import { NearContext } from "@/wallet/WalletSelector";
import { useAuth } from "@/contexts/AuthContext";


const useNEARTransfer = () => {
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
    const receiverId = process.env.RECEIVER_ID || "neo_voice.testnet";
    const transfer = async (selectedCoin: string ) => {
        if (!signedAccountId) {
            setError("Active account ID is not set.");
            return;
        }
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const amountInYocto = nearAPI.utils.format.parseNearAmount(selectedCoin);

            const transaction = {
                receiverId: receiverId,
                actions: [
                    {
                        type: "Transfer",
                        params: {
                            deposit: amountInYocto,
                        },
                    },
                ],
            };
            const results = await wallet.signAndSendTransactions({ transactions: [transaction] });
            let signerId: string | undefined;
            let depositAmount: string | undefined;
            let hash: string | undefined;

            results?.forEach((result) => {
                signerId = result.transaction.signer_id;
                console.log("..",signedAccountId);
                
                hash = result.transaction.hash;
                const action = result.transaction.actions[0];
                
                if (action?.Transfer) {
                    depositAmount = action.Transfer.deposit;
                }
            });
            setUserTrigger(true);
            return {
                success: true,
                signerId,
                depositAmount,
                hash
            };
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the transaction process."
            );
            return {
                success: false,
                error: error?.message || "An error occurred during the transaction process."
            };
        } finally {
            setLoading(false);
        }
    }
    const Usdttransfer = async (selectedCoin: string) => {
        if (!signedAccountId) {
            setError("Active account ID is not set.");
            return;
        }
        setLoading(true);
    
        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
    
          
            const amountInYocto = (parseFloat(selectedCoin) * Math.pow(10, 6)).toString();
            console.log("Amount in Yocto:", amountInYocto);
            
    
            console.log("Amount >>", selectedCoin);
            console.log("Selected Coin (USDT):", selectedCoin);
            console.log("Converted Yocto Amount:", amountInYocto);
    
            const transaction = {
                receiverId: "usdt.fakes.testnet", 
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: "ft_transfer",
                            args: {
                                receiver_id: receiverId,
                                amount: amountInYocto.toString(), 
                            },
                            gas: "30000000000000",
                            deposit: "1", 
                        },
                    },
                ],
            };
    
            const results = await wallet.signAndSendTransactions({ transactions: [transaction] });
            let signerId: string | undefined;
            let depositAmount: string | undefined;
            let hash: string | undefined;
    
            results?.forEach((result) => {
                signerId = result.transaction.signer_id;
                console.log("..", signedAccountId);
                
                hash = result.transaction.hash;
                const action = result.transaction.actions[0];
                
                if (action?.Transfer) {
                    depositAmount = action.Transfer.deposit;
                }
            });
            setUserTrigger(true);
    
            return {
                success: true,
                signerId,
                depositAmount,
                hash
            };
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the transaction process."
            );
            return {
                success: false,
                error: error?.message || "An error occurred during the transaction process."
            };
        } finally {
            setLoading(false);
        }
    }
    
    return { transfer, loading, error,Usdttransfer };
}

export default useNEARTransfer;