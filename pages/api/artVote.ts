//artVote.ts is used for upvoting the arts.
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import UpVoting from "../../model/UpVoting";
import {
  scheduleArt,
  findAllArts,
  updateArtById,
  findBattles,
  findAndupdateArtById,
} from "../../utils/artUtils";
import User from "../../model/User";
interface ResponseData {
  success: boolean;
  data?: any;
  message?: string; 
  error?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  //POST method is used for creating upvote for the arts
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { participantId, artId } = req.body;
      const user = await User.findOne({ walletAddress: participantId });
      if (user) {
        if (user.gfxCoin >= 5) {
          const existingVote = await UpVoting.findOne({ participantId, artId });
          if (existingVote?.votesCount==8) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Participant has reached limit for this art.",
              });
          } else if (existingVote) {
            // If vote exists, increment the vote count
           await UpVoting.updateOne(
              { participantId, artId },
              { $inc: { votesCount: 1 } }
            );
            await User.updateOne(
              { walletAddress: participantId },
              { 
                $inc: { 
                  gfxCoin: -5,} 
              },
            );

            return res.status(200).json({success:true,message:"Updated successfully"})
          } 
             else {
            const result = await findAndupdateArtById(artId, participantId);
            await User.updateOne(
              { walletAddress: participantId },
              { 
                $inc: { 
                  gfxCoin: -5,} 
              },
            );
            return res.status(201).json({ success: true, data: result });
          }
        } else {
          return res.status(400).json({
            success: false,
            error: "Insufficient balance to vote.",
          });
        }
      } else {
        res
          .status(400)
          .json({ success: false, error: "User profile not found." });
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      res.status(500).json({ success: false, error: "Failed to submit vote" });
    }
  }
  //GET method is used for fetching upvote by id
  if (req.method === "GET") {
    try {
      const { participantId } = req.query;
      const existingVote = await UpVoting.find({ participantId });
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
