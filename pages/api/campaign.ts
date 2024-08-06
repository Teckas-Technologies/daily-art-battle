
import type { NextApiRequest, NextApiResponse } from 'next';
import Campaign from "../../model/campaign";
import { connectToDatabase } from '../../utils/mongoose';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == 'POST') {
    await connectToDatabase();
    const data = req.body;
    await Campaign.create(data);
    return res.status(201).json({ success: true, message: "Campaign created Successfully" });
    }
  } 