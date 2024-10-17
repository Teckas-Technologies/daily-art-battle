import type { NextApiRequest, NextApiResponse } from "next";
import Campaign from "../../model/campaign";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import JwtPayload, { authenticateUser } from "../../utils/verifyToken";
import { calculateCampaignCoins } from "../../utils/campaignUtils";

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
    const email = await authenticateUser(req);
    if (req.method == "POST") {
      try {
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
        console.log(data);
        if (!campaign) {
          data.email = email;
          await Campaign.create(data);
          if(data.isSpecialRewards){
            await User.updateOne(
              { email: email },
              { $inc: { gfxCoin: - (calculatedCoins + data.specialRewards) } }
            );
          }else{
          await User.updateOne(
            { email: email },
            { $inc: { gfxCoin: -calculatedCoins } }
          );
        }
          return res
            .status(201)
            .json({ success: true, message: "Campaign created Successfully" });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Campaign already exist" });
        }
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ success: false, message: "Error campaign" });
      }
    }

    if (req.method == "GET") {
      try {
        await connectToDatabase();
        const queryType = req.query.queryType;
        if (queryType == "myCampaigns") {
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
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          console.log(today);
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
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          const totalDocuments = await Campaign.countDocuments({
            startDate: { $lt: today },
            publiclyVisible: true,
          });
          const totalPages = Math.ceil(totalDocuments / limit);
          const campaign = await Campaign.find({
            startDate: { $lt: today },
            publiclyVisible: true,
          })
            .skip(skip)
            .limit(limit);
          return res.status(200).json({
            success: true,
            data: { campaign, totalDocuments, totalPages },
          });
        }
        const title = req.query.title;
        const campaign = await Campaign.findOne({ campaignUrl: title });
        if (!campaign) {
          return res.status(404).json({
            success: false,
            message: "Campaign not found",
          });
        }
        
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
        return res.status(200).json( { campaign, status });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ success: false, message: "Error campaign" });
      }
    }

    if (req.method == "PUT") {
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
        return res
          .status(400)
          .json({ success: false, message: "Error updating campaign" });
      }
    }

    if (req.method == "DELETE") {
      try {
        await connectToDatabase();
        const id = req.query.id;
        const campaign = await Campaign.deleteOne({ _id: id });
        return res.status(200).json({ success: true, data: campaign });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ success: false, message: "Error campaign" });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
