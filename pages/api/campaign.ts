
import type { NextApiRequest, NextApiResponse } from 'next';
import Campaign from "../../model/campaign";
import { connectToDatabase } from '../../utils/mongoose';
import { CAMPAIGN_CREATION_COST } from '@/config/points';
import User from '../../model/User';
import Battle from '../../model/Battle';
import JwtPayload from '../../utils/verifyToken';
import { verifyToken } from '../../utils/verifyToken';
import { calculateCampaignCoins } from '../../utils/campaignUtils';

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
    const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, error: 'Authorization token is required' });
      }

      // Verify the token
      const { valid, decoded } = await verifyToken(token);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const payload = decoded as JwtPayload; // Cast the decoded token
      const email = payload?.emails?.[0]; // Safely access the first email

      if (!email) {
        return res.status(400).json({ success: false, error: 'Email not found in the token.' });
      }

      // Find the user by email
      const user = await User.findOne({ email });
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
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, error: 'Authorization token is required' });
      }

      // Verify the token
      const { valid, decoded } = await verifyToken(token);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }
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
          const token = req.headers['authorization']?.split(' ')[1];

          if (!token) {
            return res.status(401).json({ success: false, error: 'Authorization token is required' });
          }
    
          // Verify the token
          const { valid, decoded } = await verifyToken(token);
          if (!valid) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
          }
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
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
          return res.status(401).json({ success: false, error: 'Authorization token is required' });
        }
  
        // Verify the token
        const { valid, decoded } = await verifyToken(token);
        if (!valid) {
          return res.status(401).json({ success: false, error: 'Invalid token' });
        }
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

 