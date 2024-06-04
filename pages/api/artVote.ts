import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import UpVoting from '../../model/UpVoting';
import { scheduleArt,findAllArts,updateArtById ,findBattles} from '../../utils/artUtils';
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
      const { participantId, artId } = req.body;
      const existingVote = await UpVoting.findOne({ participantId, artId });
      if (existingVote) {
        return res.status(400).json({ success: false, message: "Participant has already voted for this art." });
      }
      const vote = await UpVoting.create({ participantId, artId });
      const result = await updateArtById(artId);
      res.status(201).json({ success: true, data: vote });
    } catch (error) {
      console.error('Error submitting vote:', error);
      res.status(500).json({ success: false, error: "Failed to submit vote" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
   if (req.method === 'GET') {
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
