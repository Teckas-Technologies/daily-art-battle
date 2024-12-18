import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust "*" to specific origins if needed
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle OPTIONS preflight request
    if (req.method === "OPTIONS") {
        return res.status(204).end(); // Respond with no content
    }

    try {
        await connectToDatabase();
        if (req.method === "POST") {
            try {
                const { referralCode } = req.body;
                const user = await User.findOne({ referralCode: referralCode });
                let isReferralCodeValid = false;
                if (user) {
                    isReferralCodeValid = true;
                }
                res.status(200).json({ isReferralCodeValid });
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
