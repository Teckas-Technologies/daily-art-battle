//artVote.ts is used for upvoting the arts.
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import UpVoting from "../../model/UpVoting";
import { authenticateUser, verifyToken } from "../../utils/verifyToken";
import User from "../../model/User";
import { ART_UPVOTE, MAX_UPVOTE } from "@/config/points";
import ArtTable from "../../model/ArtTable";
import Transactions from "../../model/Transactions";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  try {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const email = session.user.email;
    if (req.method == "POST") {
      try {
        await connectToDatabase();
        const { participantId, artId, campaignId } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User profile not found." });
        }

        if (user.nearAddress != participantId) {
          return res
            .status(404)
            .json({ success: false, error: "User wallet address not matched" });
        }

        // Check if the user has enough gfxCoin to vote
        if (user.gfxCoin < ART_UPVOTE) {
          return res
            .status(400)
            .json({ success: false, error: "Insufficient balance to vote." });
        }

        // Check if the participant has already voted for this art
        const existingVote = await UpVoting.findOne({
          email,
          participantId,
          artId,
          campaignId,
        });

        if (existingVote) {
          if (existingVote.votesCount === MAX_UPVOTE) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Participant has reached the vote limit for this art.",
              });
          }
          await ArtTable.findByIdAndUpdate(
            { _id: artId },
            { $inc: { upVotes: 1 } },
            { new: true }
          );
          await UpVoting.updateOne(
            { email, participantId, artId, campaignId },
            { $inc: { votesCount: 1 } }
          );
        } else {
          await UpVoting.create({
            email,
            participantId,
            artId,
            campaignId,
            votesCount: 1,
          });
          await ArtTable.findByIdAndUpdate(
            { _id: artId },
            { $inc: { upVotes: 1 } },
            { new: true }
          );
        }
        await User.updateOne({ email }, { $inc: { gfxCoin: -ART_UPVOTE } });
        const newTransaction = new Transactions({
          email: email,
          gfxCoin: ART_UPVOTE,
          transactionType: "spent"
        });

        await newTransaction.save();
        return res
          .status(200)
          .json({
            success: true,
            message: existingVote
              ? "Vote updated successfully."
              : "Vote created successfully.",
          });
      } catch (error) {
        console.error("Error submitting vote:", error);
        return res
          .status(500)
          .json({ success: false, error: "Failed to submit vote." });
      }
    }

    //GET method is used for fetching upvote by id
    if (req.method === "GET") {
      try {
        if (!email) {
          return res
            .status(400)
            .json({ success: false, error: "Email not found in the token." });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User profile not found." });
        }
        const { participantId, campaignId } = req.query;

        if (user.nearAddress != participantId) {
          return res
            .status(404)
            .json({ success: false, error: "User wallet address not matched" });
        }

        const existingVote = await UpVoting.find({ email, participantId, campaignId });
        res.status(200).json({ success: true, data: existingVote });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
