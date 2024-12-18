import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User from '../../model/User';
import { authenticateUser, verifyToken } from '../../utils/verifyToken';
import JwtPayload from '../../utils/verifyToken';
import { getSession } from '@auth0/nextjs-auth0';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  //To return referral link for refferals
  try {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const email = session.user.email;
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