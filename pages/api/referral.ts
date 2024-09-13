import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User from '../../model/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { walletAddress } = req.body; // Assume userId is passed via JWT or request body
  try {
    console.log(walletAddress);
    const user= await User.findOne({walletAddress:walletAddress});
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const referralLink = `http://localhost:3000/signup?referralCode=${user.referralCode}`;
    res.status(200).json({ referralLink });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
