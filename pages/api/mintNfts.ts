//mintNfts.ts is used to create battles and countVote and Update battles
import { NextApiRequest, NextApiResponse} from 'next';
import {createBattle} from '../../utils/battleSelection';
import { countVotes } from '../../utils/countVotes';
import { mintNfts } from '../../utils/mintNfts';
import { waitUntil } from '@vercel/functions';
import automateReward from '../../utils/distributeRewards';
import { connectToDatabase } from '../../utils/mongoose';
// export const config = {
//   maxDuration: 300,
// };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      //Here we'll count votes and mint nfts for audience
      const tasks = async () => {
        await countVotes();
        await createBattle();
        await mintNfts();
        await automateReward();
      };
      waitUntil(tasks());
      res.status(200).json({ success: true });
    } catch (error:any) {
      res.status(500).json({ success: false, error:error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
