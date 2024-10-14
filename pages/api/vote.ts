//vote.ts is used to create votes for the arts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import Voting from '../../model/Voting';
import JwtPayload from '../../utils/verifyToken';
import { verifyToken } from '../../utils/verifyToken';
import User from '../../model/User';
import { ART_VOTE } from '@/config/points';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }
    
    const { valid, decoded } = await verifyToken(token);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const payload = decoded as JwtPayload; // Cast the decoded token
    const email = payload.emails[0];
    const { participantId, battleId, votedFor,campaignId, fcId } = req.body;

    if (!participantId && !fcId) {
      return res.status(400).json({ success: false, message: "Either participantId or fcId must be provided." });
    }

    const query: any = { battleId, campaignId };
    if (participantId) {
      query.participantId = participantId;
    } else {
      query.fcId = fcId;
    }

    // Check if the participant has already voted for this battle
    const existingVote = await Voting.findOne(query);
    if (existingVote) {
      return res.status(400).json({ success: false, message: "Participant has already voted for this battle." });
    }


    // Create a new vote
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    // Check if the user has enough gfxCoin to vote
    if (user.gfxCoin < ART_VOTE) {
      return res.status(400).json({ success: false, message: "Insufficient balance to vote." });
    }
      const vote = await Voting.create({ participantId, battleId, votedFor ,campaignId, fcId});
      await User.updateOne(
        { email: email },
        { $inc: { gfxCoin: - ART_VOTE } }
      );
      res.status(201).json({ success: true, data: vote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
    //GET method is used to fetch vote by participantId and battleId.
  } if (req.method === 'GET') {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
      }
      
      const { valid, decoded } = await verifyToken(token);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const { participantId, battleId,campaignId, fcId } = req.query;
      if (!participantId && !fcId) {
        return res.status(400).json({ success: false, message: "Either participantId or fcId must be provided." });
      }
      const query: any = { battleId, campaignId };
      if (participantId) {
        query.participantId = participantId;
      } else {
        query.fcId = fcId;
      }
      const existingVote = await Voting.findOne(query);
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    // res.setHeader('Allow', ['GET', 'POST']);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
