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
                    const queryFilter =  req.query.sort;
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = parseInt(req.query.limit as string) || 9;
                    if(queryFilter=="voteAsc"){
                        const skip = (page - 1) * limit;
                        const raffles = await RaffleTicket.find({email:email}).skip(skip).limit(limit).sort({raffleCount:1});
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
                    }else if(queryFilter=="voteDsc"){
                        const skip = (page - 1) * limit;
                        const raffles = await RaffleTicket.find({email:email}).skip(skip).limit(limit).sort({raffleCount:-1});
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
                    }else if(queryFilter=="dateAsc"){
                        const skip = (page - 1) * limit;
                        const raffles = await RaffleTicket.find({email:email}).skip(skip).limit(limit).sort({createdAt:1});
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
                    }else if(queryFilter=="dateDsc"){
                        const skip = (page - 1) * limit;
                        const raffles = await RaffleTicket.find({email:email}).skip(skip).limit(limit).sort({createdAt:-1});
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
                    
                }else if(queryType=="search"){
                    const queryFilter = req.query.queryFilter;
                    if(queryFilter=="artName"){
                        const arttitle = req.query.arttitle;
                        const page = parseInt(req.query.page as string) || 1;
                        const limit = parseInt(req.query.limit as string) || 9;
                        const skip = limit * (page === 1 ? 0 : page - 1);
                        const raffleEntries = await RaffleTicket.aggregate([
                            {
                              $lookup: {
                                from: "arttables",
                                let: { artIdRef: { $toObjectId: "$artId" } },
                                pipeline: [
                                  { $match: { $expr: { $eq: ["$_id", "$$artIdRef"] } } }
                                ],
                                as: "artDetails"
                              }
                            },
                            { $unwind: "$artDetails" },
                            {
                                $match: {
                                  "artDetails.arttitle": { $regex: arttitle, $options: "i" },
                                  raffleCount: { $gt: 0 }
                                }
                            },
                            {
                              $project: {
                                email: 1,
                                participantId: 1,
                                artId: 1,
                                campaignId: 1,
                                raffleCount: 1,
                                isMintedNft: 1,
                                "artDetails.arttitle": 1,
                                "artDetails.colouredArt": 1,      
                                "artDetails.colouredArtReference": 1
                              }
                            }
                          ]).skip(skip)
                          .limit(limit);
                          res.status(200).json({raffleEntries });
                    }
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
