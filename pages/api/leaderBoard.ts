import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method=='GET'){
        try{
        await connectToDatabase();
        const leaders = await User.find().sort({gfxCoin:-1});
        res.status(200).json({data:leaders});
        }
        catch(error:any){
            res.status(500).json({error});
        }
    }
} 