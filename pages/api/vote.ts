//vote.ts is used to create votes for the arts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import Voting from "../../model/Voting";
import User from "../../model/User";
import { ART_VOTE } from "@/config/Points";

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
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { participantId, battleId, votedFor,campaignId } = req.body;
      const user = await User.findOne({ walletAddress: participantId });
      if (user) {
        if (user.gfxCoin >= ART_VOTE) {
          const existingVote = await Voting.findOne({
            participantId,
            battleId,
            campaignId
          });
          if (existingVote) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Participant has already voted for this battle.",
              });
          }
          // Create a new vote
          const vote = await Voting.create({
            participantId,
            battleId,
            votedFor,
            campaignId
          });
          await User.updateOne(
            { walletAddress: participantId },
            { $inc: { gfxCoin: - ART_VOTE } }
          );

          res.status(201).json({ success: true, data: vote });
        } else {
          res
            .status(400)
            .json({
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
      res.status(400).json({ success: false, error });
    }
  }
   //GET method is used to fetch vote by participantId and battleId.
  if (req.method === "GET") {
    try {
      const { participantId, battleId,campaignId } = req.query;
      const existingVote = await Voting.findOne({ participantId, battleId ,campaignId});
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    // res.setHeader('Allow', ['GET', 'POST']);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
