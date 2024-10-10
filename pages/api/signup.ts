import type { NextApiRequest, NextApiResponse} from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User ,{UserTable} from '../../model/User';
import { REFFERED_USER, REFFERER } from '@/config/points';
import Otp from '../../model/Otp';
export default async function handler(req:NextApiRequest,res:NextApiResponse){

    if(req.method=='POST'){
        try{
        await connectToDatabase();
        const data = req.body;
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }
        const otpEntry = await Otp.findOne({ email:data.email });
        if (!otpEntry) {
          return res.status(400).json({ message: 'OTP not found. Please request a new OTP.' });
        }
        if (otpEntry.otpExpiresAt < Date.now()) {
          return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }
        if (otpEntry.otp !== data.otp) {
          return res.status(400).json({ message: 'Invalid OTP' });
        }
        const referralCodeGenerated: string = Math.random().toString(36).substring(7);
        let referrer : UserTable | null = null;
        if (data.referralCode) {
          referrer = await User.findOne({ referralCode:data.referralCode });
          if (!referrer) {
            return res.status(400).json({ error: 'Invalid referral code' });
          }
        }
        const newUser = new User({
            ...data,
            referralCode: referralCodeGenerated,
            referredBy: referrer ? referrer._id : null,
            createdAt : new Date(),
            isEmailVerified : true
          });
    
          if (referrer) {
            referrer.referredUsers.push(newUser._id);
            referrer.gfxCoin += REFFERER;
            await referrer.save();
            newUser.gfxCoin += REFFERED_USER; 
          }
          const response = await newUser.save();
          await Otp.deleteOne({ email:data.email });
        res.status(201).json({user:response});
        }
        catch(error){
            res.status(500).json({error});
        }
    }
} 

