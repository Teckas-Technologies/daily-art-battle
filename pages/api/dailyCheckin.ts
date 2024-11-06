import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../utils/verifyToken";
import { connectToDatabase } from "../../utils/mongoose";
import DailyCheckin from "../../model/DailyCheckin";
import User from "../../model/User";
import { DAILY_CHECKIN, WEEKLY_CLAIM } from "@/config/points";
import Transactions from "../../model/Transactions";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        const email = await authenticateUser(req);
        await connectToDatabase();
        if(req.method=="POST"){
            try {
                const queryType = req.query.queryType;
                if(queryType=="daily"){
                let checkin = await DailyCheckin.findOne({ email });
                const today = new Date().setHours(0, 0, 0, 0);  
                if (!checkin) {
                  checkin = await DailyCheckin.create({
                    email,
                    streakDays: 1,
                    totalStreakDays: 1,
                    lastClaimedDate: today,
                  });
                  await User.updateOne(
                    { email: email },
                    { $inc: { gfxCoin: DAILY_CHECKIN } }
                  );
                  const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: DAILY_CHECKIN,  
                    transactionType: 'received'  
                  });
                  
                  await newTransaction.save();
                  return res.status(200).json({ message: 'Claimed day 1 reward!' });
                }
                const lastClaimed = new Date(checkin.lastClaimedDate).setHours(0, 0, 0, 0);
                if (today === lastClaimed) {
                  return res.status(400).json({ message: 'Already claimed today!' });
                }
                const daysDifference = (today - lastClaimed) / (1000 * 60 * 60 * 24);
                if (daysDifference > 1) {
                  checkin.streakDays = 1;
                  checkin.totalStreakDays++;
                } else {        
                  checkin.streakDays++;
                  checkin.totalStreakDays++;
                }
              
                checkin.lastClaimedDate = today;
                await checkin.save();
                await User.updateOne(
                    { email: email },
                    { $inc: { gfxCoin: DAILY_CHECKIN } }
                  );
                  const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: DAILY_CHECKIN,  
                    transactionType: 'received' 
                  });
                  
                  await newTransaction.save();
              
                res.status(200).json({
                  message: `Claimed day ${checkin.streakDays} reward!`,
                  streakDays: checkin.streakDays,
                  totalStreakDays: checkin.totalStreakDays,
                });
            }else if(queryType=="weekly"){
                const checkin = await DailyCheckin.findOne({ email });
  
                if (!checkin || checkin.streakDays < 7) {
                  return res.status(400).json({ message: '7-day streak not completed!' });
                }
              
                const today = new Date().setHours(0, 0, 0, 0);
                const lastWeeklyClaimed = new Date(checkin.lastWeeklyClaimDate).setHours(0, 0, 0, 0);
                
                if (today === lastWeeklyClaimed) {
                  return res.status(400).json({ message: 'Weekly reward already claimed today!' });
                }
                
                checkin.lastWeeklyClaimDate = today;
                checkin.streakDays = 0;
                await checkin.save();
                await User.updateOne(
                    { email: email },
                    { $inc: { gfxCoin: WEEKLY_CLAIM } }
                  );
                  const newTransaction = new Transactions({
                    email: email,
                    gfxCoin: WEEKLY_CLAIM,  
                    transactionType: 'received'  
                  });
                  
                  await newTransaction.save();
              
                res.status(200).json({ message: 'Claimed 7-day streak reward!' })
            }
            } catch (error:any) {
                res.status(400).json({error:error.message});
            }
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
}