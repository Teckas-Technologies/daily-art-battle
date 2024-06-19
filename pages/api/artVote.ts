//artVote.ts is used for upvoting the arts.
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import UpVoting from '../../model/UpVoting';
import { scheduleArt,findAllArts,updateArtById ,findBattles, findAndupdateArtById} from '../../utils/artUtils';
interface ResponseData {
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}
export const config = {
  maxDuration: 300,
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
  await connectToDatabase();
  //POST method is used for creating upvote for the arts
  switch (req.method) {
    case 'POST':
    try {
      const { participantId, artId } = req.body;
      const existingVote = await UpVoting.findOne({ participantId, artId });
      if (existingVote) {
        return res.status(400).json({ success: false, message: "Participant has already voted for this art." });
      }else{
      const result = await findAndupdateArtById(artId,participantId);
      res.status(201).json({ success: true, data: result });
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      res.status(500).json({ success: false, error: "Failed to submit vote" });
    }
    //GET method is used for fetching upvote by id
  case 'GET':
    try {
      const { participantId, artId } = req.query;
      const existingVote = await UpVoting.findOne({ participantId, artId });
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }

  default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}catch (error) {
  console.error('API error:', error);
}

}
