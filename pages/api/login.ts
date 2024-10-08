
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";

export default async function handler (req:NextApiRequest,res:NextApiResponse){
    try{
        if(req.method=="POST"){
            try{
            await connectToDatabase();
            const {email,password} = req.body;
            const user = await User.findOne({ email });
            if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
              return res.status(400).json({ message: 'Invalid email or password' });
            }
            res.status(200).json({ message: 'Login successful' });
            }
            catch (err:any) {
                res.status(500).json({ error: err.message });
              }
        }
    }
    catch(err:any){
        res.status(500).json({ error: err.message });
    }
}