import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import { PARTICIPATION_NFT_BURN, RARE_NFT_BURN } from "@/config/points";
import Transactions from "../../model/Transactions";
import Battle from "../../model/Battle";
import RaffleTicket from "../../model/RaffleTicket";
import { TransactionType } from "../../model/enum/TransactionType";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        const email = await authenticateUser(req);
        if(req.method=="PUT"){
            const queryType = req.query.queryType;
            const {raffleId} =  req.body;
            if(queryType=="spinner"){
                await Battle.findOneAndUpdate(
                    { _id:raffleId },
                    { $set: { isSpecialWinnerMinted: true } },
                    { new: true }
                );

                const response = await User.findOneAndUpdate(
                    { email:email },
                    { $inc: { gfxCoin: RARE_NFT_BURN } },
                    { new: true }
                );
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: RARE_NFT_BURN,
                    transactionType: TransactionType.RECEIVED_FROM_BURN
                  });
                  await newTransaction.save();
                res.status(200).json({message:"Updated successfully"})
            }else if(queryType=="raffles"){

               const raffle=  await RaffleTicket.findOneAndUpdate(
                    { _id:raffleId },
                    { $set: { isMintedNft: true } },
                    { new: true }
                );
                if (!raffle) {
                    throw new Error("Raffle not found");
                }
                const noOfcoll = raffle.raffleCount;
                const response = await User.findOneAndUpdate(
                    { email:email },
                    { $inc: { gfxCoin:  noOfcoll * PARTICIPATION_NFT_BURN } },
                    { new: true }
                );
                const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: noOfcoll * PARTICIPATION_NFT_BURN, 
                    transactionType: TransactionType.RECEIVED_FROM_BURN
                  });
                  await newTransaction.save();
                  res.status(200).json({message:"Updated successfully"})

            }
        }
    } catch (error:any) {
        res.status(500).json({error:error.message});
        
    }
}