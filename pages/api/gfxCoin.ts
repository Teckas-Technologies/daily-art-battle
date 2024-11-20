import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import { graphQLService } from "@/data/graphqlService";
import { ACCOUNT_DATE } from "@/data/queries/accountDate.graphql";
import { providers, utils } from 'near-api-js';
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import Hashes from "../../model/Hashes";
import  { authenticateUser } from "../../utils/verifyToken";
import { BEFORE_MAY_2021, DEFAULT, EMAIL_VERIFY, GFXCOIN_PER_NEAR, INSTA_CONNECT, MAY_2021_AND_AFTER, PARTICIPATION_NFT_BURN, RARE_NFT_BURN, REGISTERED, TELEGRAM_DROP, X_CONNECT, YEAR_2022, YEAR_2023 } from "@/config/points";
import { error } from "console";
import Transactions from "../../model/Transactions";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        await connectToDatabase()
        try{
        const email = await authenticateUser(req);
        const user = await User.findOne({email:email});
        if(!user){
            res.status(400).json({error:"User profile not found"});
        }
        const query = req.query.queryType as string;
        const walletAddress = user.nearAddress;

        if (!walletAddress || !query) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        try {
            if (query === 'burnNft') {
                try {
                    const transactionHash = req.query.transactionHash;
                    const existinghash = await Hashes.findOne({hash:transactionHash});
                    if(existinghash){
                        return res.status(500).json({error:"Hash already used"});
                    }
                    const provider = new providers.JsonRpcProvider({ url: `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org` });
                    const transaction = await provider.txStatus(transactionHash as string, 'unused') as providers.FinalExecutionOutcome;
                    if (isFinalExecutionStatusWithSuccessValue(transaction.status)) {
                        const signerId = transaction.transaction.signer_id;
                        const receiver_id = transaction.transaction.receiver_id;
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
                            await updateUserCoins(email, coins);
                            const newHash = new Hashes({
                                email: email,
                                walletAddress:walletAddress,
                                hash:transactionHash
                            })
                            await newHash.save();
                            const newTransaction = new Transactions({
                                email: email,
                                gfxCoin: coins,
                                transactionType: "received"
                            });
                            await newTransaction.save();
                       
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
                await handleDrop(email, coins, isClaimedField);
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: coins,
                    transactionType: "received"
                });
                await newTransaction.save();
            }
            else if (query === 'nearDrop') {
                let isClaimedField = 'isNearDropClaimed';
                const coins = await calculateNearDropCoins(walletAddress);
                await handleDrop(email, coins, isClaimedField);
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: coins,
                    transactionType: "received"
                });
                await newTransaction.save();
            } else if (query === 'telegramDrop') {
                const {userId} = req.body; 
                const coins = await calculateTelegramDropCoins(userId);
                console.log(coins);
                let isClaimedField = 'isTelegramDropClaimed';
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: coins,
                    transactionType: "received"
                });
                await newTransaction.save();
                await handleDrop(email, coins, isClaimedField);
            } else if (query === 'instaConnect') {
                const coins = INSTA_CONNECT;
                let isClaimedField = 'isInstagramConnected';
                await handleDrop(email, coins, isClaimedField);
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: coins,
                    transactionType: "received"
                });
                await newTransaction.save();
            } else if (query === 'XConnect') {
                const coins = X_CONNECT;
                let isClaimedField = 'isXConnected';
                await handleDrop(email, coins, isClaimedField);
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: coins,
                    transactionType: "received"
                });
                await newTransaction.save();
            }
            else if (query === 'registered') {
                const coins = REGISTERED;
                let isClaimedField = 'isRegistered';
                await handleDrop(email, coins, isClaimedField);
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: coins,
                    transactionType: "received"
                });
                await newTransaction.save();
            } else if (query === 'mint') {
                const transactionHash = req.query.transactionHash;
                const existinghash = await Hashes.findOne({hash:transactionHash});
                if(existinghash){
                    return res.status(500).json({error:"Hash already used"});
                }
                const newHash = new Hashes({
                    email:email,
                    walletAddress:walletAddress,
                    hash:transactionHash
                })
                await newHash.save();
            }
            else if(query ==='nearTransfer'){
                try {
                    const transactionHash = req.query.transactionHash;
                    const existinghash = await Hashes.findOne({hash:transactionHash});
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
                        await updateUserCoins(email, coins);
                        const newHash = new Hashes({
                            email:email,
                            walletAddress:walletAddress,
                            hash:transactionHash
                        })
                        await newHash.save();
                        const newTransaction = new Transactions({
                            email: email,
                            gfxCoin: coins,
                            transactionType: "received"
                        });
                        await newTransaction.save();
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
    catch(error:any){
        return res.status(400).json({error:error.message});
    }
    }else if(req.method=="GET"){
        await connectToDatabase();
        try {
            const transactionHash = req.query.transactionHash;
            const existinghash = await Hashes.findOne({hash:transactionHash});
            if(existinghash){
                return res.status(400).json({error:"Hash already used"});
            }else{
                return res.status(200).json({message:"Hash not used"});
            }
        } catch(error:any){
            return res.status(400).json({error:error.message});
        }
    }
    else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}

// Helper function to update user coins
async function updateUserCoins(email: string, coins: number) {
    const user = await User.findOne({ email:email });
    if(!user){
       throw new Error(`User doesn't exist`);
    }
    const response = await User.findOneAndUpdate(
        { email:email },
        { $inc: { gfxCoin: coins } },
        { new: true }
    );

    const newTransaction = new Transactions({
        email: email,
        gfxCoin: coins, 
        transactionType: "received"
      });
      await newTransaction.save();
      console.log(response);
}

// Helper function to handle drop claims
async function handleDrop(email: string, coins: number, isClaimedField: string) {
    const user = await User.findOne({ email });
     if(!user){
        throw new Error(`User doesn't exist`);
     }
    if (user && !user[isClaimedField]) {
        await updateUserCoins(email, coins);
        await User.findOneAndUpdate(
            { email },
            { [isClaimedField]: true },
            { new: true }
        );
    } else {
        throw new Error(`${isClaimedField.replace('is', '')} has already been claimed`);
    }
}

async function calculateTelegramDropCoins(userId: any) {
    const response = await axios.get(`http://127.0.0.1:5000/airdrop/${userId}`)
    const creationDate = response.data.date;
    console.log(creationDate);
    const accountCreationYear = new Date(creationDate).getFullYear();
    const accountCreationMonth = new Date(creationDate).getMonth() + 1;

    if (accountCreationYear < 2021 || (accountCreationYear === 2021 && accountCreationMonth < 5)) {
        return BEFORE_MAY_2021;
    } else if (accountCreationYear === 2021 && accountCreationMonth >= 5) {
        return MAY_2021_AND_AFTER;
    } else if (accountCreationYear === 2022) {
        return YEAR_2022;
    } else if (accountCreationYear === 2023) {
        return YEAR_2023;
    } else {
        return DEFAULT;
    }
}

async function calculateNearDropCoins(walletAddress: string) {
    const creationDate = await findCreationDate(walletAddress);
    const accountCreationYear = new Date(creationDate).getFullYear();
    const accountCreationMonth = new Date(creationDate).getMonth() + 1;

    if (accountCreationYear < 2021 || (accountCreationYear === 2021 && accountCreationMonth < 5)) {
        return BEFORE_MAY_2021;
    } else if (accountCreationYear === 2021 && accountCreationMonth >= 5) {
        return MAY_2021_AND_AFTER;
    } else if (accountCreationYear === 2022) {
        return YEAR_2022;
    } else if (accountCreationYear === 2023) {
        return YEAR_2023;
    } else {
        return DEFAULT;
    }
}


function calculateGfxPoints(nearAmount:any) {
    const gfxPointsPerNear = GFXCOIN_PER_NEAR; 
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
    