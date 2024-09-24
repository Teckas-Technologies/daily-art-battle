//art.ts is used for creating creating arts ,fetching arts and updating art by id.
import type { NextApiRequest, NextApiResponse } from 'next';
import ArtTable from '../../model/ArtTable';
import { scheduleArt,findAllArts,updateArtById ,findBattles,findPreviousArts,findPreviousArtsByVotes,findArtById,findAllArtsByDate,findAllArtsByVoteAsc,findAllArtsByDateAsc} from '../../utils/artUtils';
import { connectToDatabase } from '../../utils/mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method=='GET'){
        await connectToDatabase();
        const campaignId = "gfxvs";
        try {
            // Update all art entries with the provided campaignId
            const result = await ArtTable.updateMany(
              {},
              { campaignId },
              { new: true }
            );
    
            return res.status(200).json({ message: `${result.modifiedCount} art entries updated` });
          } catch (error) {
            return res.status(500).json({ message: 'Error updating art entries', error });
          }
    
    }
}
        