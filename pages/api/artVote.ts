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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await connectToDatabase();
  //POST method is used for creating upvote for the arts
  if (req.method === 'POST') {
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
  } 
  //GET method is used for fetching upvote by id
   if (req.method === 'GET') {
    try {
      const { participantId } = req.query;
      const existingVote = await UpVoting.find({participantId });
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } 
} 
