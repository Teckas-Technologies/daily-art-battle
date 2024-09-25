//artUpload.ts is used for creating creating arts.
import type { NextApiRequest, NextApiResponse } from 'next';
import { scheduleArt, findAllArts, updateArtById, findBattles, findPreviousArts, findPreviousArtsByVotes, findArtById, findAllArtsByDate, findAllArtsByVoteAsc, findAllArtsByDateAsc } from '../../utils/artUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            //POST method is used to create art from mintbase ai-agent.
            case 'POST':
                const art = req.body;
                console.log("Art >> ", art)
                art.campaignId = "gfxvs";
                console.log("Art >> ", art)
                const saveart = await scheduleArt(art);
                return res.status(201).json(saveart);
            default:
                res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: "Server Error" });
    }
}
