import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import Voting from '../../model/Voting';

interface ResponseData {
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { participantId, battleId, votedFor } = req.body;

    // Check if the participant has already voted for this battle
    const existingVote = await Voting.findOne({ participantId, battleId });
    if (existingVote) {
      return res.status(400).json({ success: false, message: "Participant has already voted for this battle." });
    }

    // Create a new vote
    try {
      const vote = await Voting.create({ participantId, battleId, votedFor });
      res.status(201).json({ success: true, data: vote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } if (req.method === 'GET') {
    try {
      const { participantId, battleId } = req.query;
      const existingVote = await Voting.findOne({ participantId, battleId });
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
