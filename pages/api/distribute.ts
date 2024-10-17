import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../utils/verifyToken";
import { connectToDatabase } from "../../utils/mongoose";
import campaign from "../../model/campaign";
import { error } from "console";
import User from "../../model/User";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
    await connectToDatabase();
    const email = await authenticateUser(req);
    if(req.method=='GET'){
        const {userList,campaignId} = req.body;
        const campaigns = await campaign.findOne({_id:campaignId});
        if(!campaigns.isSpecialRewards){
            res.status(400).json({error:"rewards is not eligle"});
        }
         const rewardPerUser = campaigns.specialRewards / userList.length;
         await Promise.all(
         userList.map(async (email:any) => {
            await User.updateOne(
              { email: email }, 
              { $inc: { gfxCoin: rewardPerUser } } 
            );
          })
         );
         console.log(`Distributed ${rewardPerUser} GFX coins to each user.`);
         return res.status(200).json({message:"Reward distributed"});
    }
    }
    catch(error:any){
        return res.status(400).json({error});
    }

}