import type { NextApiRequest, NextApiResponse } from 'next';
import { scheduleBattle, deleteAll, findTodaysBattle, findPreviousBattles, findAllBattles, updateBattle } from '../../utils/battleUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        const battle = req.body;
        const scheduledBattle = await scheduleBattle(battle);
        return res.status(201).json(scheduledBattle);

      case 'GET':
        const { queryType } = req.query;
        if (queryType === 'Today') {
          const todayBattle = await findTodaysBattle();
          return res.status(200).json(todayBattle);
        } else if (queryType === 'battles') {
          const battles = await findPreviousBattles();
          return res.status(200).json(battles);
        } else {
          const battles = await findAllBattles();
          return res.status(200).json(battles);
        }
      case 'PUT':
        const { battleId } = req.query;
        if (!battleId) {
          return res.status(400).json({ error: 'Battle ID is required' });
        }
        await updateBattle(battleId);
        return res.status(200).json({ message: 'Battle Updated' });
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
