import type { NextApiRequest, NextApiResponse} from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User ,{UserTable} from '../../model/User';
import ArtTable from '../../model/ArtTable';
export default async function handler(req:NextApiRequest,res:NextApiResponse){

    if(req.method=='POST'){
        try{
        await connectToDatabase();
        const data = req.body;
        const existingUser = await User.findOne({
            $or: [
              { email: data.email },
              { walletAddress: data.walletAddress }
            ]
          });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
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
          });
    
          if (referrer) {
            referrer.referredUsers.push(newUser._id);
            referrer.gfxCoin += 100;
            await referrer.save();
    
            newUser.gfxCoin += 50; 
          }
          const response = await newUser.save();
        res.status(201).json({user:response});
        }
        catch(error){
            res.status(500).json({error});
        }
    }
    if(req.method=='GET'){
        const queryType = req.query.queryType;
        if(queryType=='arts'){
            try{
            await connectToDatabase();
            const walletAddress = req.query.walletAddress;
            const arts = await ArtTable.find({artistId:walletAddress});
            res.status(200).json({data:arts});
            }
            catch(error){
                res.status(500).json({error:error});
            }
        }
        try{
        await connectToDatabase();
        const id = req.query.id;
        const profiles = await User.findById({_id:id});
        res.status(200).json({data:profiles});
        }catch(error){
            res.status(500).json({error});
        }
    }

    if(req.method=='PUT'){
        try{
        await connectToDatabase();
        const id = req.query.id;
        const data = req.body;
        const profile = await User.findByIdAndUpdate(id,data);
        res.status(200).json({message:"Updated successfully"});
        }catch(error){
            res.status(500).json({error});
        }
    }
} 

