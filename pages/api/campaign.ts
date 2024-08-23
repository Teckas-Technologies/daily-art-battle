
import type { NextApiRequest, NextApiResponse } from 'next';
import Campaign from "../../model/campaign";
import { connectToDatabase } from '../../utils/mongoose';
import uploadVideoToAzure from '../../utils/campaignUtils'
export default async function handler( req: NextApiRequest,res: NextApiResponse) {
     if (req.method == 'POST') {
      try{
    await connectToDatabase();
    const data = req.body;
    const campaign = await Campaign.findOne({campaignTitle : data.campaignTitle})
    if (data.video) {
      const videoUrl = await uploadVideoToAzure(data.video, `${data.campaignTitle}.mp4`);
      data.video = videoUrl; // Replace base64 with the video URL
    }

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
        const campaign = await Campaign.find();
        return res.status(200).json({ success: true, data:campaign});
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

      if(req.method=='PUT'){
        try{
        await connectToDatabase();
        const id = req.query.id;
        const existingCampaign = await Campaign.findById(id);
        const data = req.body;
        if (data.video) {
          const videoUrl = await uploadVideoToAzure(data.video, `${data.campaignTitle}.mp4`);
          data.video = videoUrl; // Replace base64 with the video URL
        }    else{
          data.video = existingCampaign.video;
        }
        const updatedCampaign = await Campaign.findOneAndUpdate(
          { _id: id },
          { $set: data },
          { new: true } 
        );
        return res.status(200).json({ success: true, data:updatedCampaign});
      }
      catch(error){
        console.log(error);
        return res.status(400).json({ success: false, message: 'Error campaign' });
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