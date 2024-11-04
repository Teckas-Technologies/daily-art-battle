import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import RaffleTicket from "../../model/RaffleTicket";
import calaculateRafflePoints from "../../utils/raffleUtils";
import Transactions from "../../model/Transactions";
import ArtTable from "../../model/ArtTable";
import mongoose from "mongoose";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        await connectToDatabase();
        const email = await authenticateUser(req);
        const user = await User.findOne({email});
        if(req.method=='POST'){
            try{
            const { artId,campaignId,ticketCount } = req.body;
            if (!artId || !ticketCount || !campaignId) {
                return res.status(400).json({ error: 'artId, and ticketCount are required' });
              }
            const requiredCoins = await calaculateRafflePoints(ticketCount);
            if(user.gfxCoin<requiredCoins){
                return res.status(400).json({ message: 'User does not have enough balance to buy raffles' });
            }

            const existingRaffleTicket = await RaffleTicket.findOne({artId:artId,email:email,campaignId:campaignId});
            if(existingRaffleTicket){
                existingRaffleTicket.raffleCount += ticketCount;
                existingRaffleTicket.save();
            }else{
                const createNewRaffle = new RaffleTicket({
                    email:email,
                    participantId: user.nearAddress,
                    artId: artId,
                    campaignId:campaignId,
                    raffleCount:ticketCount,
                })
                createNewRaffle.save();
            }
            await ArtTable.findByIdAndUpdate({ _id: artId },{ $inc: { raffleTickets: ticketCount } },{ new: true });

            await User.updateOne({ email }, { $inc: { gfxCoin: -requiredCoins } });
            const newTransaction = new Transactions({
              email: email,
              gfxCoin: requiredCoins,  
              transactionType: "spent"  
            });
            await newTransaction.save();
            
            res.status(201).json({ message: 'Raffle tickets purchased successfully' });
        }catch(error:any){
            res.status(400).json({error:error.message});
        }
        }
        else if(req.method=="GET"){
            try{
                const queryType = req.query.queryType;
                if(queryType=="raffles"){
                    const raffles = await RaffleTicket.find({email:email});
                    const rafflesWithArtUrls = await Promise.all(raffles.map(async (raffle) => {
                        const art = await ArtTable.findOne({ _id: new mongoose.Types.ObjectId(raffle.artId) });
                        
                        const plainRaffle = raffle.toObject();
                        return {
                            ...plainRaffle, 
                            colouredArt: art ? art.colouredArt : null,
                            colouredArtReference : art ? art.colouredArt : null,
                        };
                    }));
                    res.status(200).json({ message: 'User raffles',rafflesWithArtUrls });
                }
                const { artId,campaignId} = req.query;
                const totalRaffle = await RaffleTicket.findOne({email:email,artId:artId,campaignId:campaignId});
                res.status(200).json({ message: 'Raffle tickets Counts', totalRaffleCounts:totalRaffle?.raffleCount });
            }catch(error:any){
            res.status(400).json({error:error.message});
            }
    }

    }catch(error:any){
        res.status(400).json({error:error.message});
    }
}
