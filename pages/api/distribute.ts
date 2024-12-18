import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../utils/verifyToken";
import { connectToDatabase } from "../../utils/mongoose";
import campaign from "../../model/campaign";
import { error } from "console";
import User from "../../model/User";
import Transactions from "../../model/Transactions";
import { TransactionType } from "../../model/enum/TransactionType";
import { getSession } from "@auth0/nextjs-auth0";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
    await connectToDatabase();
      const session = await getSession(req, res);
          if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
      const email = session.user.email;
    //This api to distribute special rewards of campaign
    if(req.method=='POST'){
        const {artList,campaignId} = req.body;
        const campaigns = await campaign.findOne({_id:campaignId});
        if(!campaigns.isSpecialRewards){
            res.status(400).json({error:"rewards is not eligle"});
        }
        if(campaigns.distributedRewards){
          res.status(400).json({error:"rewards is already distributed"});
      }
         const rewardPerUser = campaigns.specialRewards / artList.length;
         await Promise.all(
          artList.map(async (art: any) => {
              const userEmail = art.email;
              await User.updateOne(
                  { email: userEmail },
                  { $inc: { gfxCoin: rewardPerUser } }
              );
              const newTransaction = new Transactions({
                  email: userEmail,
                  gfxCoin: rewardPerUser,
                  transactionType: TransactionType.RECEIVED_FROM_SPECIAL_REWARD
              });
              await newTransaction.save();
          })
      );

         await campaign.updateOne(
            { _id: campaignId },
            {
              $addToSet: {
                specialRewardsArtId: { $each: artList.map((art:any) => art._id) }
              },
              $set: { distributedRewards: true }
            }
          );
          
         console.log(`Distributed ${rewardPerUser} GFX coins to each user.`);
         return res.status(200).json({message:"Reward distributed"});
    }
    }
    catch(error:any){
        return res.status(400).json({error:error.message});
    }

}