//battlespinner.ts is used to fetch today battle and return spinner url with emoji
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTodayBattle } from '../../utils/battleUtils';
import spinnerWithEmoji from '../../utils/farcasterSpinnerUtil';
import uploadArweave from '../../utils/uploadArweave';
import { verifyToken } from '../../utils/verifyToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ success: false, error: 'Authorization token is required' });
        }
        // Verify the token
        const { valid, decoded } = await verifyToken(token);
        if (!valid) {
          return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        switch (req.method) {
            //GET method is used to fetch today battle and return spinner with emoji
            case 'GET':
                const response = await fetchTodayBattle();
                if (!response || response?.length === 0) {
                    return res.status(400).json({ error: "No battle today!" });
                }
                const artA = response[0].artAcolouredArt;
                const artB = response[0].artBcolouredArt;
                const spinnerRes = await spinnerWithEmoji(artA, artB);
                console.log("Base64:", spinnerRes?.gif);
                const urlRes = await uploadArweave(spinnerRes?.gif);
                console.log("Url: ", urlRes)
                return res.status(200).json({ spinnerUrl: urlRes?.url, metadata: urlRes?.referenceUrl, emoji1: spinnerRes?.emoji1, emoji2: spinnerRes?.emoji2, battleId: response[0]?._id.toString() });
            default:
                res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: "Server Error" });
    }
}
