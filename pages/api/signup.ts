import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User, { UserTable } from '../../model/User';
import { REFFERED_USER, REFFERER } from '@/config/points';
import { verifyToken } from '../../utils/verifyToken';
import JwtPayload from '../../utils/verifyToken';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
      }
      
      const { valid, decoded } = await verifyToken(token);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const payload = decoded as JwtPayload; // Cast the decoded token
      const email = payload.emails[0]; // Extract email from the decoded token

      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const referralCodeGenerated: string = Math.random().toString(36).substring(7);
      let referrer: UserTable | null = null;
      if (payload.extension_referralCode) {
        referrer = await User.findOne({ referralCode: payload.extension_referralCode });
        if (!referrer) {
          return res.status(400).json({ error: 'Invalid referral code' });
        }
      }

      const newUser = new User({
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: email,
        referralCode: referralCodeGenerated,
        referredBy: referrer ? referrer._id : null,
        createdAt: new Date(),
        isEmailVerified: true,
      });

      if (referrer) {
        referrer.referredUsers.push(newUser._id);
        referrer.gfxCoin += REFFERER;
        await referrer.save();
        newUser.gfxCoin += REFFERED_USER;
      }

      const response = await newUser.save();
      res.status(201).json({ user: response });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
