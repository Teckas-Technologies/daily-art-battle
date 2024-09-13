
import type { NextApiRequest, NextApiResponse } from 'next';
import Campaign from "../../model/Campaign";
import { connectToDatabase } from '../../utils/mongoose';
import { CAMPAIGN_CREATION_COST } from '@/config/Points';
import User from '../../model/User';
import Battle from '../../model/Battle';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Adjust this to your needs
    },
    responseLimit: '100mb',
  },
};

export default async function handler( req: NextApiRequest,res: NextApiResponse) {
     if (req.method == 'POST') {
      try{
    await connectToDatabase();
    const data = req.body;
    const user = await User.findOne({ walletAddress: data.creatorId });
    if(!user){
     return res
      .status(400)
      .json({ success: false, error: "User profile not found." });
    }
    const calculatedCoins = await calculateCampaignCoins(data.startDate,data.endDate);
    if(user.gfxCoin < calculatedCoins){
     return res.status(400).json({
        success: false,
        error: "Insufficient balance to upload art.",
      });
    }
    const campaign = await Campaign.findOne({campaignUrl : data.campaignUrl})
    console.log(data);
    if(!campaign){
    await Campaign.create(data);
    await User.updateOne(
      { walletAddress: data.creatorId },
      { $inc: { gfxCoin: -calculatedCoins } }
    );
    return res.status(201).json({ success: true, message: "Campaign created Successfully" });
    }else{
      return res.status(400).json({ success: false, message: "Campaign already exist" });
    }
    }
      catch(error){
        console.log(error);
        return res.status(400).json({ success: false, message: 'Error campaign' });
      }
    }

    if (req.method == 'GET') {
      try{
      await connectToDatabase();
      const queryType = req.query.queryType;
      if(queryType=='myCampaigns'){
        const walletAddress = req.query.walletAddress;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const totalDocuments = await Campaign.countDocuments({creatorId:walletAddress});
        const totalPages = Math.ceil(totalDocuments / limit);
        const campaign = await Campaign.find({creatorId:walletAddress}).skip(skip).limit(limit);
        return res.status(200).json({ success: true, data:{campaign,totalDocuments,totalPages}});
      }
      else if(queryType=='upcoming'){
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); 
        const totalDocuments = await Campaign.countDocuments({ startDate: { $gt: today } });
        const totalPages = Math.ceil(totalDocuments / limit);
        const campaign = await Campaign.find({ startDate: { $gt: today } }).skip(skip).limit(limit);
        return res.status(200).json({ success: true, data:{campaign,totalDocuments,totalPages}});
      }
      else if(queryType=='current'){
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); 
        console.log(today);
        const totalDocuments = await Campaign.countDocuments({ startDate: { $eq: today } });
        const totalPages = Math.ceil(totalDocuments / limit);
        const campaign = await Campaign.find({ startDate: { $eq: today } }).skip(skip).limit(limit);
        return res.status(200).json({ success: true, data:{campaign,totalDocuments,totalPages}});
      }else if(queryType=='completed'){
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); 
        const totalDocuments = await Campaign.countDocuments({ startDate: { $lt: today } });
        const totalPages = Math.ceil(totalDocuments / limit);
        const campaign = await Campaign.find({ startDate: { $lt: today } }).skip(skip).limit(limit);
        return res.status(200).json({ success: true, data:{campaign,totalDocuments,totalPages}});
      }
      const title = req.query.title;
      const campaign = await Campaign.findOne({campaignTitle:title});
      return res.status(200).json({ success: true, data:campaign});
    }
    catch(error){
      console.log(error);
      return res.status(400).json({ success: false, message: 'Error campaign' });
    }
      }

      if (req.method == 'PUT') {
        try {
          await connectToDatabase();
          const id = req.query.id;
          const existingCampaign = await Campaign.findById(id);
          const data = req.body;
    
      
          if (!data.video) {
            data.video = existingCampaign?.video;
          }
      
          // Update the campaign with the new or existing data
          const updatedCampaign = await Campaign.findOneAndUpdate(
            { _id: id },
            { $set: data },
            { new: true }
          );
      
          return res.status(200).json({ success: true, data: updatedCampaign });
        } catch (error) {
          console.log(error);
          return res.status(400).json({ success: false, message: 'Error updating campaign' });
        }
      }
      
    
      if (req.method == 'DELETE') {
        try{
        await connectToDatabase();
        const id = req.query.id;
        const campaign = await Campaign.deleteOne({_id:id});
        return res.status(200).json({ success: true, data:campaign});
        }
        catch(error){
          console.log(error);
          return res.status(400).json({ success: false, message: 'Error campaign' });
        }
        }
  } 

  async function calculateCampaignCoins(startDate: any, endDate: any) {
    // Ensure startDate and endDate are Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Validate if both dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date provided");
    }
  
    // Get the difference in time (milliseconds)
    const diffInMs = end.getTime() - start.getTime();

    // Convert milliseconds into days and add 1 to include both start and end dates
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    // Coins to be spent: 10,000 per day
    const coinsPerDay = CAMPAIGN_CREATION_COST;
    const totalCoins = diffInDays * coinsPerDay;
  
    return totalCoins;
  }
  