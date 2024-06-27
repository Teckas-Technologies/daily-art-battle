//mintNfts.ts is used to create battles and countVote and Update battles
import { NextApiRequest, NextApiResponse } from 'next';
import Battle from '../../model/Battle';
import ArtTable from '../../model/ArtTable';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      //Here we'll count votes and mint nfts for audience
      const pipeline = [
        {
          $project: {
            artAId: 1, // Include the _id field
            artAspecialWinner: 1, // Include the special_winner field
            artAVotes: 1, // Include the votes field
            startTime: 1,
            endTime: 1 // Include the startedTime field
          }
        }
      ];
      const battleData = await Battle.aggregate(pipeline);

try{
      for (const battleDoc of battleData) {
        await ArtTable.updateOne(
          { _id: battleDoc.artAId },
          {
            $set: {
              specialWinner: battleDoc.artAspecialWinner,
              votes: battleDoc.artAVotes,
              endTime: battleDoc.endTime,
              battleTime : battleDoc.startTime
            }
          },
          { upsert: true } 
        );
      }
      console.log('Merge completed successfully');
    }catch(error){
        console.log("error");
    }
      res.status(200).json({ battleData});
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
