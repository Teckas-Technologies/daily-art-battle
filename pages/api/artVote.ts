//artVote.ts is used for upvoting the arts.
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import UpVoting from '../../model/UpVoting';
import { scheduleArt, findAllArts, updateArtById, findBattles, findAndupdateArtById } from '../../utils/artUtils';
import { verifyToken } from '../../utils/verifyToken';
import JwtPayload from '../../utils/verifyToken';
import User from '../../model/User';
import { ART_UPVOTE, MAX_UPVOTE } from '@/config/points';
import ArtTable from '../../model/ArtTable';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  if (req.method == "POST") {
    try {
      await connectToDatabase();
      const { participantId, artId, campaignId } = req.body;
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
      if (!user) {
        return res.status(404).json({ success: false, error: "User profile not found." });
      }

      // Check if the user has enough gfxCoin to vote
      if (user.gfxCoin < ART_UPVOTE) {
        return res.status(400).json({ success: false, error: "Insufficient balance to vote." });
      }

      // Check if the participant has already voted for this art
      const existingVote = await UpVoting.findOne({ participantId, artId, campaignId });

      if (existingVote) {
        if (existingVote.votesCount === MAX_UPVOTE) {
          return res.status(400).json({ success: false, message: "Participant has reached the vote limit for this art." });
        }
        await ArtTable.findByIdAndUpdate(
          {_id:artId},
          { $inc: { upVotes: 1 } },
          { new: true }
        );
        await UpVoting.updateOne({ participantId, artId, campaignId }, { $inc: { votesCount: 1 } });
      } else {
        await UpVoting.create({ participantId, artId, campaignId, votesCount: 1 });
        await ArtTable.findByIdAndUpdate(
          {_id:artId},
          { $inc: { upVotes: 1 } },
          { new: true }
        );
      }
      await User.updateOne({ email }, { $inc: { gfxCoin: -ART_UPVOTE } });

      return res.status(200).json({ success: true, message: existingVote ? "Vote updated successfully." : "Vote created successfully." });
    } catch (error) {
      console.error("Error submitting vote:", error);
      return res.status(500).json({ success: false, error: "Failed to submit vote." });
    }
  }


  //GET method is used for fetching upvote by id
  if (req.method === 'GET') {
    try {
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, error: 'Authorization token is required' });
      }

      // Verify the token
      const { valid, decoded } = await verifyToken(token);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const { participantId, campaignId } = req.query;
      const existingVote = await UpVoting.find({ participantId, campaignId });
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
} 
