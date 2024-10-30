import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User from '../../model/User';
import { authenticateUser, verifyToken } from '../../utils/verifyToken';
import JwtPayload from '../../utils/verifyToken';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  try {
    const email = await authenticateUser(req);
    const user= await User.findOne({email:email});
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const referralLink = `http://localhost:3000/signup?referralCode=${user.referralCode}`;
    res.status(200).json({ referralLink });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}