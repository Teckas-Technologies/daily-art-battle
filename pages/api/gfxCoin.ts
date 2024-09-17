import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import { graphQLService } from "@/data/graphqlService";
import { ACCOUNT_DATE } from "@/data/queries/accountDate.graphql";
import { providers, utils } from 'near-api-js';
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import Transactions from "../../model/Transactions";
import { EMAIL_VERIFY, INSTA_CONNECT, PARTICIPATION_NFT_BURN, RARE_NFT_BURN, REGISTERED, TELEGRAM_DROP, X_CONNECT } from "@/config/Points";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        await connectToDatabase();
        const query = req.query.queryType as string;
        const walletAddress = req.query.walletAddress as string;

        if (!walletAddress || !query) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        try {
            if (query === 'burnNft') {
                try {
                    const transactionHash = req.query.transactionHash;
                    const existinghash = await Transactions.findOne({hash:transactionHash});
                    if(existinghash){
                        return res.status(500).json({error:"Hash already used"});
                    }
                    const provider = new providers.JsonRpcProvider({ url: `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org` });
                    const transaction = await provider.txStatus(transactionHash as string, 'unused') as providers.FinalExecutionOutcome;
                    if (isFinalExecutionStatusWithSuccessValue(transaction.status)) {
                        const signerId = transaction.transaction.signer_id;
                        const receiver_id = transaction.transaction.receiver_id;
                        console.log(signerId);
                        console.log(receiver_id);
                        if(receiver_id!=walletAddress){
                            return res.status(500).json({error:"wallet doesn't match"});
                        }
                        const contractAddress = transaction.transaction.actions[0].Delegate.delegate_action.receiver_id
                        console.log(contractAddress)
                        let coins =0;
                        if(contractAddress === ART_BATTLE_CONTRACT){
                            coins = PARTICIPATION_NFT_BURN;
                        }else if(contractAddress === SPECIAL_WINNER_CONTRACT){
                            coins = RARE_NFT_BURN;
                        }else{
                            return res.status(500).json({error:"transaction is not valid"});
                        }
                            await updateUserCoins(walletAddress, coins);
                            const newHash = new Transactions({
                                walletAddress:walletAddress,
                                hash:transactionHash
                            })
                            await newHash.save();
                       
                    } else {
                        res.status(500).json({ error: "transaction is not success" });
                    }
                }
                catch (error: any) {
                    res.status(500).json({ error: error.message });
                }
            }
            else if (query === 'emailVerify') {
                const coins = EMAIL_VERIFY;
                let isClaimedField = 'isEmailVerified';
                await handleDrop(walletAddress, coins, isClaimedField);
            }
            else if (query === 'nearDrop') {
                let isClaimedField = 'isNearDropClaimed';
                const coins = await calculateNearDropCoins(walletAddress);
                await handleDrop(walletAddress, coins, isClaimedField);
            } else if (query === 'telegramDrop') {
                const coins = TELEGRAM_DROP;
                let isClaimedField = 'isTelegramDropClaimed';
                await handleDrop(walletAddress, coins, isClaimedField);
            } else if (query === 'instaConnect') {
                const coins = INSTA_CONNECT;
                let isClaimedField = 'isInstagramConnected';
                await handleDrop(walletAddress, coins, isClaimedField);
            } else if (query === 'XConnect') {
                const coins = X_CONNECT;
                let isClaimedField = 'isXConnected';
                await handleDrop(walletAddress, coins, isClaimedField);
            }
            else if (query === 'registered') {
                const coins = REGISTERED;
                let isClaimedField = 'isRegistered';
                await handleDrop(walletAddress, coins, isClaimedField);
            }else if(query ==='nearTransfer'){
                try {
                    const transactionHash = req.query.transactionHash;
                    const existinghash = await Transactions.findOne({hash:transactionHash});
                    if(existinghash){
                        return res.status(500).json({error:"Hash already used"});
                    }
                    const provider = new providers.JsonRpcProvider({ url: `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org` });
                    const transaction = await provider.txStatus(transactionHash as string, 'unused') as providers.FinalExecutionOutcome;
                    if (isFinalExecutionStatusWithSuccessValue(transaction.status)) {
                        const signerId = transaction.transaction.signer_id;
                        const receiver_id = transaction.transaction.receiver_id;
                        console.log(signerId);
                        console.log(receiver_id);
                        if(signerId!=walletAddress){
                            return res.status(500).json({error:"wallet doesn't match"});
                        }
                        const amount = utils.format.formatNearAmount(transaction.transaction.actions[0].Transfer.deposit);
                        const coins = calculateGfxPoints(amount)
                        await updateUserCoins(walletAddress, coins);
                        const newHash = new Transactions({
                            walletAddress:walletAddress,
                            hash:transactionHash
                        })
                        await newHash.save();
                    } else {
                        res.status(500).json({ error: "transaction is not success" });
                    }
                }
                catch (error: any) {
                    res.status(500).json({ error: error.message });
                }
            }
            return res.status(200).json({ message: "Updated successfully" });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}

// Helper function to update user coins
async function updateUserCoins(walletAddress: string, coins: number) {
    const user = await User.findOne({ walletAddress });
    if(!user){
       throw new Error(`User doesn't exist`);
    }
    const response = await User.findOneAndUpdate(
        { walletAddress },
        { $inc: { gfxCoin: coins } },
        { new: true }
    );
    console.log(response);
}

// Helper function to handle drop claims
async function handleDrop(walletAddress: string, coins: number, isClaimedField: string) {
    const user = await User.findOne({ walletAddress });
     if(!user){
        throw new Error(`User doesn't exist`);
     }
    if (user && !user[isClaimedField]) {
        await updateUserCoins(walletAddress, coins);
        await User.findOneAndUpdate(
            { walletAddress },
            { [isClaimedField]: true },
            { new: true }
        );
    } else {
        throw new Error(`${isClaimedField.replace('is', '')} has already been claimed`);
    }
}


async function calculateNearDropCoins(walletAddress: string) {
    const creationDate = await findCreationDate(walletAddress);
    const accountCreationYear = new Date(creationDate).getFullYear();
    const accountCreationMonth = new Date(creationDate).getMonth() + 1;

    if (accountCreationYear < 2021 || (accountCreationYear === 2021 && accountCreationMonth < 5)) {
        return 2000;
    } else if (accountCreationYear === 2021 && accountCreationMonth >= 5) {
        return 1500;
    } else if (accountCreationYear === 2022) {
        return 1000;
    } else if (accountCreationYear === 2023) {
        return 500;
    } else {
        return 10;
    }
}


function calculateGfxPoints(nearAmount:any) {
    const gfxPointsPerNear = 1000; 
    const gfxPoints = nearAmount * gfxPointsPerNear;
    return gfxPoints;
  }

async function findCreationDate(walletAddress: string) {
    const response = await graphQLService({
        query: ACCOUNT_DATE,
        variables: { account_id: walletAddress },
        network: "testnet"
    });

    const { creation_date } = response.data.accounts[0].created_at;
    console.log(response.data.accounts[0].created_at);
    return creation_date;
}

function isFinalExecutionStatusWithSuccessValue(status: any) {
    return status && typeof status.SuccessValue === 'string';
}
    