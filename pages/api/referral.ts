import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User from '../../model/User';
import { verifyToken } from '../../utils/verifyToken';
import JwtPayload from '../../utils/verifyToken';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }
    
    const { valid, decoded } = await verifyToken(token);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    const payload = decoded as JwtPayload; 
    const email = payload.emails[0];
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