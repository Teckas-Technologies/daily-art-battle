import type { NextApiRequest, NextApiResponse } from 'next';
import { scheduleArt,findAllArts,updateArtById ,findBattles} from '../../utils/artUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
       case 'POST':
        const art = req.body;
        const saveart = await scheduleArt(art);
        return res.status(201).json(saveart);
        case 'GET':
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const arts = await findAllArts(page, limit);
            return res.status(200).json(arts);
        case 'PUT':
          const { id } = req.query;
          const idString = typeof id === 'string' ? id : String(id); 
          if (typeof idString === 'string') {
            const result = await updateArtById(idString);
            if (result) {
              return res.status(200).json(result);
            } else {
              return res.status(404).json({ error: "Art not found" });
            }
          } else {
            return res.status(400).json({ error: "ID is required for updating" });
          }
        
      default:
        res.setHeader('Allow', ['POST', 'GET', 'DELETE','PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: "Server Error" });
  }
}
