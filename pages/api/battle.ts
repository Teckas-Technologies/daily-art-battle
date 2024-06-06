//battle.ts is used for creating battle,updating battle ,fetching battle and deleting battle.
import type { NextApiRequest, NextApiResponse } from 'next';
import { scheduleBattle, deleteAll, findTodaysBattle, findPreviousBattles, findAllBattles, updateBattle } from '../../utils/battleUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      //POST method is used for creating battle
      case 'POST':
        const battle = req.body;
        const scheduledBattle = await scheduleBattle(battle);
        return res.status(201).json(scheduledBattle);
      //GET method is used for fetching battles
      case 'GET':
        const { queryType } = req.query;
        //Here we'll fetch today battles
        if (queryType === 'Today') {
          const todayBattle = await findTodaysBattle();
          return res.status(200).json(todayBattle);
        //Here we'll fetch battles with pagination
        } else if (queryType === 'battles') {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const battles = await findPreviousBattles(page,limit);
          return res.status(200).json(battles);
        } else {
          const battles = await findAllBattles();
          return res.status(200).json(battles);
        }
      //PUT method is used to update battle by id
      case 'PUT':
        const { battleId } = req.query;
        if (!battleId) {
          return res.status(400).json({ error: 'Battle ID is required' });
        }
        await updateBattle(battleId);
        return res.status(200).json({ message: 'Battle Updated' });
      //DELETE method is used to delete battle by id
      case 'DELETE':
        await deleteAll();
        return res.status(200).json({ message: 'All battles deleted' });

      default:
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: "Server Error" });
  }
}
