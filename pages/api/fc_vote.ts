//vote.ts is used to create votes for the arts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import FcVote from '../../model/FcVoting';

interface ResponseData {
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
    const { participantId, battleId, votedFor,campaignId } = req.body;

    // Check if the participant has already voted for this battle
    const existingVote = await FcVote.findOne({ participantId, battleId ,campaignId});
    if (existingVote) {
      return res.status(400).json({ success: false, message: "Participant has already voted for this battle." });
    }

    // Create a new vote
   
      const vote = await FcVote.create({ participantId, battleId, votedFor ,campaignId});
      res.status(201).json({ success: true, data: vote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
    //GET method is used to fetch vote by participantId and battleId.
  } if (req.method === 'GET') {
    try {
      const { participantId, battleId,campaignId } = req.query;
      const existingVote = await FcVote.findOne({ participantId, battleId ,campaignId});
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    // res.setHeader('Allow', ['GET', 'POST']);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}