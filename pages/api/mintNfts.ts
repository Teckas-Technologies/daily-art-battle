//mintNfts.ts is used to create battles and countVote and Update battles
import { NextApiRequest, NextApiResponse } from 'next';
import { countVotesAndUpdateBattle } from '../../utils/countVotesAndBattles';
import {createBattle} from '../../utils/battleSelection';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      //Here we'll count votes and mint nfts for audience
        await countVotesAndUpdateBattle();
      //If there is no battle available new battle we'll be created between the arts
        await createBattle();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
