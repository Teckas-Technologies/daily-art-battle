import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import RaffleTicket from "../../model/RaffleTicket";
import calaculateRafflePoints from "../../utils/raffleUtils";
import Transactions from "../../model/Transactions";
import ArtTable from "../../model/ArtTable";

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
            const tickets = Array.from({ length: ticketCount }).map(() => ({
            participantId: user.nearAddress,
            artId: artId,
            email:email,
            campaignId:campaignId
            }));

            await ArtTable.findByIdAndUpdate({ _id: artId },{ $inc: { raffleTickets: ticketCount } },{ new: true });

            await User.updateOne({ email }, { $inc: { gfxCoin: -requiredCoins } });
            const newTransaction = new Transactions({
              email: email,
              gfxCoin: requiredCoins,  
              transactionType: "spent"  
            });
            await newTransaction.save();
            const createdTickets = await RaffleTicket.insertMany(tickets);
            res.status(201).json({ message: 'Raffle tickets purchased successfully', tickets: createdTickets });
        }catch(error:any){
            res.status(400).json({error:error.message});
        }
        }
        else if(req.method=="GET"){
            try{
                const queryType = req.query.queryType;
                if(queryType=="arts"){
                    const { artId,campaignId} = req.query;
                    const totalRaffle = await RaffleTicket.find({artId:artId,campaignId:campaignId});
                    res.status(200).json({ message: 'Raffle tickets Counts', totalRaffleCounts:totalRaffle.length,totalRaffle: totalRaffle });
                }else{
                const { artId,campaignId} = req.query;
                const totalRaffle = await RaffleTicket.find({email:email,artId:artId,campaignId:campaignId});
                res.status(200).json({ message: 'Raffle tickets Counts', totalRaffleCounts:totalRaffle.length,totalRaffle: totalRaffle });
                }
            }catch(error:any){
            res.status(400).json({error:error.message});
            }
    }

    }catch(error:any){
        res.status(400).json({error:error.message});
    }
}
