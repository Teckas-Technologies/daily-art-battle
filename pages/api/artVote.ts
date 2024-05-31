import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import UpVoting from '../../model/UpVoting';
interface ResponseData {
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { participantId, artId} = req.body;

    // Check if the participant has already voted for this battle
    const existingVote = await UpVoting.findOne({ participantId, artId });
    console.log(existingVote);
    if (existingVote) {
      return res.status(400).json({ success: false, message: "Participant has already voted for this art." });
    }else{
    try {
      const vote = await UpVoting.create({ participantId, artId});
      console.log(vote);
      res.status(201).json({ success: true, data: vote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }

    }
  } if (req.method === 'GET') {
    try {
      const { participantId, artId } = req.query;
      const existingVote = await UpVoting.findOne({ participantId, artId });
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
