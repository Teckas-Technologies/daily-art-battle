//mintNfts.ts is used to create battles and countVote and Update battles
import { NextApiRequest, NextApiResponse } from 'next';
import {createBattle} from '../../utils/battleSelection';
import { countVotes } from '../../utils/countVotes';
import { mintNfts } from '../../utils/mintNfts';

export const config = {
  maxDuration: 300,
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      //Here we'll count votes and mint nfts for audience
      await countVotes();
      await createBattle();

      setTimeout(async () => {
        try {
          await mintNfts();
        } catch (error) {
          console.error('Background mintNfts error:', error);
        }
      }, 20000);
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
