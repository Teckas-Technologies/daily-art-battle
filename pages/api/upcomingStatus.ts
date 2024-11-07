import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../utils/verifyToken";
import { connectToDatabase } from "../../utils/mongoose";
import ArtTable from "../../model/ArtTable";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        const email = await authenticateUser(req);
        await connectToDatabase();
        //Here we will return the status of the upcoming arts section
        if(req.method=='GET'){
            const campaignId = req.query.id;
            const upcomingBattleArts = (await ArtTable.find({campaignId:campaignId,isStartedBattle:false})).length;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const uploadedToday = (await ArtTable.find({campaignId:campaignId,uploadedTime: {$gte: today,  $lt: tomorrow }})).length;
            const dayOfWeek = today.getDay(); 
            const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - diffToMonday);
            const uploadedThisWeek = (await ArtTable.find({campaignId:campaignId,uploadedTime: {$gte: startOfWeek,  $lte: today}})).length;
            return res.status(200).json({upcomingBattleArts,uploadedToday,uploadedThisWeek});
        }
    }catch(error:any){
        res.status(400).json({error:error.message});
    }
}