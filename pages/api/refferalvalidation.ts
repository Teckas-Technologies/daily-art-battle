import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        if(req.method=='POST'){
            try {
                const {referralCode} = req.body;
                const user = await User.findOne({referralCode:referralCode});
                let isReferralCodeValid = false;
                if(user){
                    isReferralCodeValid = true;
                }
                res.status(200).json({isReferralCodeValid});
            } catch (error:any) {
                res.status(400).json({error:error.message});
            }
        }
    } catch (error:any) {
        res.status(500).json({error:error.message});
    }
}