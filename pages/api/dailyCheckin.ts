import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../utils/verifyToken";
import { connectToDatabase } from "../../utils/mongoose";
import DailyCheckin from "../../model/DailyCheckin";
import User from "../../model/User";
import { ART_UPLOAD, DAILY_CHECKIN, WEEKLY_CLAIM } from "@/config/points";
import Transactions from "../../model/Transactions";
import { TransactionType } from "../../model/enum/TransactionType";
import { getSession } from "@auth0/nextjs-auth0";
import { AdminTransactionType } from "../../model/enum/AdminTransactionType";
import { updateAdminBalance } from "../../utils/updateAdminBal";
import { createTransaction } from "../../utils/updateAdminTrans";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
          const session = await getSession(req, res);
          if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
          const email = session.user.email;
        await connectToDatabase();
        //To claim daily reward 
        if(req.method=="POST"){
            try {
                const queryType = req.query.queryType;
                if(queryType=="daily"){
                let checkin = await DailyCheckin.findOne({ email });
                const today = new Date().setUTCHours(0, 0, 0, 0);  
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
                    transactionType: TransactionType.RECEIVED_FROM_DAILY_CHECKIN  
                  });
                  
                  await newTransaction.save();

                  const transaction = await createTransaction(DAILY_CHECKIN, AdminTransactionType.SPENT_FOR_DAILY_CHECKIN,email);
                  const updatedBalance = await updateAdminBalance(DAILY_CHECKIN, AdminTransactionType.SPENT);
                  return res.status(200).json({ message: 'Claimed day 1 reward!' });
                }
                const lastClaimed = new Date(checkin.lastClaimedDate).setUTCHours(0, 0, 0, 0);
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
                    transactionType:  TransactionType.RECEIVED_FROM_DAILY_CHECKIN 
                  });
                  
                  await newTransaction.save();
                  const transaction = await createTransaction(DAILY_CHECKIN, AdminTransactionType.SPENT_FOR_DAILY_CHECKIN,email);
                  const updatedBalance = await updateAdminBalance(DAILY_CHECKIN, AdminTransactionType.SPENT);
              
                res.status(200).json({
                  message: `Claimed day ${checkin.streakDays} reward!`,
                  streakDays: checkin.streakDays,
                  totalStreakDays: checkin.totalStreakDays,
                });

            //To claim weekly reward
            }else if(queryType=="weekly"){
                const checkin = await DailyCheckin.findOne({ email });
  
                if (!checkin || checkin.streakDays < 7) {
                  return res.status(400).json({ message: '7-day streak not completed!' });
                }
              
                const today = new Date().setUTCHours(0, 0, 0, 0);
                const lastWeeklyClaimed = new Date(checkin.lastWeeklyClaimDate).setUTCHours(0, 0, 0, 0);
                
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
                    transactionType:  TransactionType.RECEIVED_FROM_WEEKLY_CLAIM 
                  });
                  
                  await newTransaction.save();
                  const transaction = await createTransaction(WEEKLY_CLAIM, AdminTransactionType.SPENT_FOR_WEEKLY_CLAIM,email);
                  const updatedBalance = await updateAdminBalance(WEEKLY_CLAIM, AdminTransactionType.SPENT);
              
                res.status(200).json({ message: 'Claimed 7-day streak reward!' })
            }
            } catch (error:any) {
                res.status(400).json({error:error.message});
            }
        }else if(req.method=='GET'){
          try {
            await connectToDatabase();
            const dailyCheckin = await DailyCheckin.findOne({ email: email });

            if (dailyCheckin) {
              const today = new Date();
              const yesterday = new Date();
              
              yesterday.setDate(today.getDate() - 1);
              const todayDateOnly = today.toISOString().split('T')[0];
              const yesterdayDateOnly = yesterday.toISOString().split('T')[0];
              const lastClaimedDateOnly = new Date(dailyCheckin.lastClaimedDate).toISOString().split('T')[0];
              if (lastClaimedDateOnly !== todayDateOnly && lastClaimedDateOnly !== yesterdayDateOnly) {
                  dailyCheckin.streakDays = 0;
              }
              
              res.status(200).json({data:dailyCheckin});
            } else {
              res.status(400).json({ error: 'DailyCheckin record not found' });
            }
          } catch (error:any) {
            res.status(400).json({error:error.message});
          }
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
}