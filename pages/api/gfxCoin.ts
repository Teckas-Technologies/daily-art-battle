import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import { graphQLService } from "@/data/graphqlService";
import { ACCOUNT_DATE } from "@/data/queries/accountDate.graphql";
import { providers, utils } from 'near-api-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const gfxCoinHashMap: { [key: string]: number } = {
        rareNft: 1000,
        spinnerNft : 10, 
        telegramDrop: 2000,
        instaConnect: 10,
        XConnect: 10,
        emailVerify: 10,
        registered: 100
    };

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
                    const nftType = req.query.nftType as string;
                    if (!(nftType in gfxCoinHashMap)) {
                        return res.status(400).json({ message: "Invalid query type" });
                    }
                    const coins = gfxCoinHashMap[nftType];
                    const transactionHash = req.query.transactionHash;
                    const provider = new providers.JsonRpcProvider({ url: "https://rpc.testnet.near.org" });
                    const transaction = await provider.txStatus(transactionHash as string, 'unused') as providers.FinalExecutionOutcome;
                    console.log(transaction);
                    if (isFinalExecutionStatusWithSuccessValue(transaction.status)) {
                        const receiverId = transaction.transaction.receiver_id;
                        if (receiverId === walletAddress) {
                            await updateUserCoins(walletAddress, coins);
                        } else {
                            res.status(500).json({ error: "wallet address is not valid" });
                        }
                    } else {
                        res.status(500).json({ error: "transaction is not success" });
                    }
                }
                catch (error: any) {
                    res.status(500).json({ error: error.message });
                }
            }
            else if (query === 'emailVerify') {
                if (!(query in gfxCoinHashMap)) {
                    return res.status(400).json({ message: "Invalid query type" });
                }
                const coins = gfxCoinHashMap[query];
                let isClaimedField = 'isEmailVerified';
                await handleDrop(walletAddress, coins, isClaimedField);
            }
            else if (query === 'nearDrop') {
                let isClaimedField = 'isNearDropClaimed';
                const coins = await calculateNearDropCoins(walletAddress);
                await handleDrop(walletAddress, coins, isClaimedField);
            } else if (query === 'telegramDrop') {
                if (!(query in gfxCoinHashMap)) {
                    return res.status(400).json({ message: "Invalid query type" });
                }
                const coins = gfxCoinHashMap[query];
                let isClaimedField = 'isTelegramDropClaimed';
                await handleDrop(walletAddress, coins, isClaimedField);
            } else if (query === 'instaConnect') {
                if (!(query in gfxCoinHashMap)) {
                    return res.status(400).json({ message: "Invalid query type" });
                }
                const coins = gfxCoinHashMap[query];
                let isClaimedField = 'isInstagramConnected';
                await handleDrop(walletAddress, coins, isClaimedField);
            } else if (query === 'XConnect') {
                if (!(query in gfxCoinHashMap)) {
                    return res.status(400).json({ message: "Invalid query type" });
                }
                const coins = gfxCoinHashMap[query];
                let isClaimedField = 'isXConnected';
                await handleDrop(walletAddress, coins, isClaimedField);
            }
            else if (query === 'registered') {
                if (!(query in gfxCoinHashMap)) {
                    return res.status(400).json({ message: "Invalid query type" });
                }
                const coins = gfxCoinHashMap[query];
                let isClaimedField = 'isRegistered';
                await handleDrop(walletAddress, coins, isClaimedField);
            }else if(query ==='nearTransfer'){
                try {
                    const transactionHash = req.query.transactionHash;
                    const provider = new providers.JsonRpcProvider({ url: "https://rpc.testnet.near.org" });
                    const transaction = await provider.txStatus(transactionHash as string, 'unused') as providers.FinalExecutionOutcome;
                   console.log(transaction);
                    if (isFinalExecutionStatusWithSuccessValue(transaction.status)) {
                        const receiverId = transaction.transaction.receiver_id;
                        const amount = transaction.transaction.actions[0].Transfer.deposit;
                        const coins = calculateGfxPoints(amount)
                        console.log(amount);
                        await updateUserCoins(walletAddress, coins);
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


function calculateGfxPoints(yoctoNear:any) {
    const oneNearInYocto = 10 ** 24; 
    const gfxPointsPerNear = 1000; 
    const nearAmount = yoctoNear / oneNearInYocto;
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
    