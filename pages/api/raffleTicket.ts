import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import RaffleTicket from "../../model/RaffleTicket";
import calaculateRafflePoints from "../../utils/raffleUtils";
import Transactions from "../../model/Transactions";
import ArtTable from "../../model/ArtTable";
import mongoose from "mongoose";
import Battle from "../../model/Battle";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        await connectToDatabase();
        const email = await authenticateUser(req);
        const user = await User.findOne({email});
        //Here will create raffle tickets for specific arts
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
        //Here we will return the users raffle tickets and their collected arts
        else if(req.method=="GET"){
            try{
                const queryType = req.query.queryType;
                if(queryType=="spinner"){
                    const queryFilter =  req.query.sort;
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = parseInt(req.query.limit as string) || 9;
                    if(queryFilter=="voteAsc"){
                        const skip = (page - 1) * limit;
                        const totalDocuments = await Battle.countDocuments({ specialWinner:email});
                        const totalPages = Math.ceil(totalDocuments / limit);
                        const spinner = await Battle.aggregate([
                            {
                              $match: { specialWinner: email}
                            },
                            {
                              $addFields: {
                                totalVotes: { $add: ["$artAVotes", "$artBVotes"] }
                              }
                            },
                            {
                              $sort: { totalVotes: 1, _id: 1 }
                            },
                            {
                              $skip: skip
                            },
                            {
                              $limit: limit
                            }
                          ]);
                   
                    res.status(200).json({ totalDocuments,totalPages,spinner});
                    }else if(queryFilter=="voteDsc"){
                        const skip = (page - 1) * limit;
                        const totalDocuments = await Battle.countDocuments({ specialWinner:email});
                        const totalPages = Math.ceil(totalDocuments / limit);
                        const spinner = await Battle.aggregate([
                            {
                              $match: { specialWinner: email}
                            },
                            {
                              $addFields: {
                                totalVotes: { $add: ["$artAVotes", "$artBVotes"] }
                              }
                            },
                            {
                              $sort: { totalVotes: -1, _id: 1 }
                            },
                            {
                              $skip: skip
                            },
                            {
                              $limit: limit
                            }
                          ]);
                   
                    res.status(200).json({ totalDocuments,totalPages,spinner});
                    }else if(queryFilter=="dateAsc"){

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const skip = (page - 1) * limit;
                        const totalDocuments = await Battle.countDocuments({ specialWinner:email, endTime: { $lt: today }});
                        const totalPages = Math.ceil(totalDocuments / limit);
                        const pastBattles = await Battle.find({ specialWinner:email, endTime: { $lt: today }}).sort({ startTime: 1 ,_id: 1 }).skip(skip).limit(limit);
                        return { pastBattles,totalDocuments,totalPages };

                    }else if(queryFilter=="dateDsc"){
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const skip = (page - 1) * limit;
                        const totalDocuments = await Battle.countDocuments({ specialWinner:email, endTime: { $lt: today }});
                        const totalPages = Math.ceil(totalDocuments / limit);
                        const pastBattles = await Battle.find({ specialWinner:email, endTime: { $lt: today }}).sort({ startTime: -1 ,_id: 1 }).skip(skip).limit(limit);
                        return { pastBattles,totalDocuments,totalPages };

                    }
                }
                else if(queryType=="raffles"){
                    const queryFilter =  req.query.sort;
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = parseInt(req.query.limit as string) || 9;
                    if(queryFilter=="voteAsc"){
                        const skip = (page - 1) * limit;
                        const totalDocuments = await RaffleTicket.countDocuments({ email });
                        const totalPages = Math.ceil(totalDocuments / limit);
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
                    res.status(200).json({ message: 'User raffles',rafflesWithArtUrls,totalDocuments,totalPages });
                    }else if(queryFilter=="voteDsc"){
                        const skip = (page - 1) * limit;
                        const totalDocuments = await RaffleTicket.countDocuments({ email });
                        const totalPages = Math.ceil(totalDocuments / limit);
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
                    res.status(200).json({ message: 'User raffles',rafflesWithArtUrls,totalDocuments,totalPages });
                    }else if(queryFilter=="dateAsc"){
                        const skip = (page - 1) * limit;
                        const totalDocuments = await RaffleTicket.countDocuments({ email });
                        const totalPages = Math.ceil(totalDocuments / limit);
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
                    res.status(200).json({ message: 'User raffles',rafflesWithArtUrls,totalDocuments,totalPages });
                    }else if(queryFilter=="dateDsc"){
                        const skip = (page - 1) * limit;
                        const totalDocuments = await RaffleTicket.countDocuments({ email });
                        const totalPages = Math.ceil(totalDocuments / limit);
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
                    res.status(200).json({ message: 'User raffles',rafflesWithArtUrls,totalDocuments,totalPages });
                    }
               //Here user can search arts based on art name
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
                          const totalDocuments = raffleEntries.length;
                         const totalPages = Math.ceil(totalDocuments / limit);
                          res.status(200).json({raffleEntries,totalPages,totalDocuments});
                    }
                }else{
                const { artId,campaignId} = req.query;
                const totalRaffle = await RaffleTicket.findOne({email:email,artId:artId,campaignId:campaignId});
                res.status(200).json({ message: 'Raffle tickets Counts', totalRaffleCounts:totalRaffle?.raffleCount});
                }
            }catch(error:any){
            res.status(400).json({error:error.message});
            }
    }else if(req.method=="PUT"){
      const raffleId = req.query.raffleId;
      try {
        const updatedRaffle = await RaffleTicket.findOneAndUpdate(
          { _id:raffleId }, 
          { $set: {isMintedNft: true} }, 
          { new: true, upsert: false } 
        );
      
        if (!updatedRaffle) {
          return res.status(404).json({ message: "Raffle not found" });
        }
      
        return res.status(200).json({
          message: "Raffle updated successfully",
          data: updatedRaffle,
        });
      } catch (error) {
        console.error("Error updating raffle:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    }catch(error:any){
        res.status(400).json({error:error.message});
    }
}
