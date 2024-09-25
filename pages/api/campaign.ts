
import type { NextApiRequest, NextApiResponse } from 'next';
import Campaign from "../../model/campaign";
import { connectToDatabase } from '../../utils/mongoose';
import uploadVideoToAzure from '../../utils/campaignUtils'

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
    const campaign = await Campaign.findOne({campaignUrl : data.campaignUrl})
    console.log(data);
    if(!campaign){
    await Campaign.create(data);
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
      if(queryType=='campaigns'){
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const totalDocuments = await Campaign.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        const campaign = await Campaign.find().skip(skip).limit(limit);;
        return res.status(200).json({ success: true, data:{campaign,totalDocuments,totalPages}});
      }
      if(queryType=='campaignsAll'){
        const today = new Date().toISOString().split('T')[0];
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const totalDocuments = await Campaign.countDocuments({    $or: [
          { 
            startDate: { $lte: today },  
            endDate: { $gte: today }
          },
          {
            startDate: { $gt: today } 
          }
        ]});
        const totalPages = Math.ceil(totalDocuments / limit);
        const campaigns = await Campaign.find({
          $or: [
            { 
              startDate: { $lte: today },  
              endDate: { $gte: today }
            },
            {
              startDate: { $gt: today } 
            }
          ]
        }).skip(skip).limit(limit);
      
        return res.status(200).json({ success: true, data:{campaigns,totalDocuments,totalPages}});
      }
      const title = req.query.title;
      const campaign = await Campaign.findOne({campaignUrl:title});
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