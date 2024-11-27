import type { NextApiRequest, NextApiResponse } from "next";
import Campaign from "../../model/campaign";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import JwtPayload, { authenticateUser } from "../../utils/verifyToken";
import { calculateCampaignCoins } from "../../utils/campaignUtils";
import Transactions from "../../model/Transactions";
import ArtTable from "../../model/ArtTable";
import { validateUser } from "../../utils/validateClient";
import { TransactionType } from "../../model/enum/TransactionType";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb", // Adjust this to your needs
    },
    responseLimit: "100mb", 
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
       //To Create campaign
    if (req.method == "POST") {
      try {
        const email = await authenticateUser(req);
        await connectToDatabase();
        const data = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ success: false, error: "User profile not found." });
        }
        const calculatedCoins = await calculateCampaignCoins(
          data.startDate,
          data.endDate
        );
        if (user.gfxCoin < calculatedCoins) {
          return res.status(400).json({
            success: false,
            error: "Insufficient balance to create campaign.",
          });
        }
        if (data.isSpecialRewards && (user.gfxCoin < (calculatedCoins + data.specialRewards))) {
          return res.status(400).json({
            success: false,
            error: "Insufficient balance to create campaign.",
          });
        }
        const campaign = await Campaign.findOne({
          campaignUrl: data.campaignUrl,
        });
        if (!campaign) {
          data.email = email;
          data.creatorId = user.nearAddress;
          await Campaign.create(data);
          if(data.isSpecialRewards){
            await User.updateOne(
              { email: email },
              { $inc: { gfxCoin: - (calculatedCoins + data.specialRewards) } }
            );
            const newTransaction = new Transactions({
              email: email,
              gfxCoin: (calculatedCoins + data.specialRewards),  
              transactionType: TransactionType.SPENT_FOR_CAMPAIGN 
            });
            
            await newTransaction.save();
          }else{
          await User.updateOne(
            { email: email },
            { $inc: { gfxCoin: -calculatedCoins } }
          );
          const newTransaction = new Transactions({
            email: email,
            gfxCoin: calculatedCoins,  
            transactionType: TransactionType.SPENT_FOR_CAMPAIGN   
          });
          
          await newTransaction.save();
        }
          return res
            .status(201)
            .json({ success: true, message: "Campaign created Successfully" });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Campaign already exist" });
        }
      } catch (error:any) {
        return res
          .status(400)
          .json({ success: false, message: error.message });
      }
    }

    if (req.method == "GET") {
      try {
        await connectToDatabase();
           //To fetch campaigns based on some filters
        const queryType = req.query.queryType;
        if (queryType == "myCampaigns") {
          const email = await authenticateUser(req);
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
          const totalDocuments = await Campaign.countDocuments({
            email: email,
          });
          const totalPages = Math.ceil(totalDocuments / limit);
          const campaign = await Campaign.find({ email: email })
            .skip(skip)
            .limit(limit);
          return res.status(200).json({
            success: true,
            data: { campaign, totalDocuments, totalPages },
          });
        } else if (queryType == "upcoming") {
          await validateUser(req);
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          const totalDocuments = await Campaign.countDocuments({
            startDate: { $gt: today },
            publiclyVisible: true,
          });
          const totalPages = Math.ceil(totalDocuments / limit);
          const campaign = await Campaign.find({
            startDate: { $gt: today },
            publiclyVisible: true,
          })
            .skip(skip)
            .limit(limit);
          return res.status(200).json({
            success: true,
            data: { campaign, totalDocuments, totalPages },
          });
        } else if (queryType == "current") {
          await validateUser(req);
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          const totalDocuments = await Campaign.countDocuments({
            startDate: { $lte: today },
            endDate: { $gte: today },
            publiclyVisible: true,
          });
          const totalPages = Math.ceil(totalDocuments / limit);
          const campaign = await Campaign.find({
            startDate: { $lte: today },
            endDate: { $gte: today },
            publiclyVisible: true,
          })
            .skip(skip)
            .limit(limit);
          return res.status(200).json({
            success: true,
            data: { campaign, totalDocuments, totalPages },
          });
        } else if (queryType == "completed") {
          await validateUser(req);
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          const totalDocuments = await Campaign.countDocuments({
            startDate: { $lt: today },
            endDate: { $lt: today },
            publiclyVisible: true,
          });
          const totalPages = Math.ceil(totalDocuments / limit);
          const campaign = await Campaign.find({
            startDate: { $lt: today },
            endDate: { $lt: today },
            publiclyVisible: true,
          })
            .skip(skip)
            .limit(limit);
          return res.status(200).json({
            success: true,
            data: { campaign, totalDocuments, totalPages },
          });
        }
        await validateUser(req);
        const title = req.query.title;
        const campaign = await Campaign.findOne({ campaignUrl: title });
        if (!campaign) {
          return res.status(404).json({
            success: false,
            message: "Campaign not found",
          });
        }
        const participants = await ArtTable.aggregate([
          { $match: { campaignId: campaign._id.toString() } },
          { $group: { _id: "$email" } },
          { $count: "uniqueParticipants" }
        ]);
        
        const uniqueParticipantCount = participants.length > 0 ? participants[0].uniqueParticipants : 0;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); 
        
        let status = "";
        if (campaign.startDate > today) {
          status = "upcoming";
        } else if (campaign.startDate <= today && (!campaign.endDate || campaign.endDate >= today)) {
          status = "current";
        } else if (campaign.endDate < today) {
          status = "completed";
        }
        return res.status(200).json( { campaign, status,participants:uniqueParticipantCount });
      } catch (error:any) {
        console.log(error);
        return res
          .status(400)
          .json({ success: false, message: error.message });
      }
    }

    if (req.method == "PUT") {
      try {
        const email = await authenticateUser(req);
        await connectToDatabase();
          //Update campaign based on campaign id
        const data = req.body;
        const updatedCampaign = await Campaign.findOneAndUpdate(
          { _id: data._id },
          { $set: data },
          { new: true }
        );

        return res.status(200).json({ success: true, data: updatedCampaign });
      } catch (error:any) {
        return res
          .status(400)
          .json({ success: false, message: error.message });
      }
    }
    
   //Delete campaign based on campaign id
    if (req.method == "DELETE") {
      try {
        const email = await authenticateUser(req);
        await connectToDatabase();
        const id = req.query.id;
        const campaign = await Campaign.deleteOne({ _id: id });
        return res.status(200).json({ success: true, data: campaign });
      } catch (error:any) {
        return res
          .status(400)
          .json({ success: false, message: error.message });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
