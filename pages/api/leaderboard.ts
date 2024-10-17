import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import { authenticateUser } from "../../utils/verifyToken";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method=='GET'){
        try{
        const email = await authenticateUser(req);    
        await connectToDatabase();
        const users = await User.find({}, { firstName: 1, lastName: 1, gfxCoin: 1 }).sort({ gfxCoin: -1 });
        const leaders = users.map((user, index) => ({
            firstName: user.firstName,
            lastName: user.lastName,
            gfxvsCoins: user.gfxCoin,
            rank: index + 1 
        }));
        res.status(200).json({data:leaders});
        }   
        catch(error:any){
            res.status(500).json({error});
        }
    }
} 