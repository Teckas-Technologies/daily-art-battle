import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import Transactions from "../../model/Transactions";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
        await connectToDatabase();
        const email = await authenticateUser(req);
        //Here we will return thre transaction details of the user
        if(req.method=='GET'){
            try{
            const transaction = await Transactions.find({email:email});
            return res.status(200).json({transaction});
            }catch(error:any){
                return res.status(400).json({error});
            }
        }
    }
    catch(error:any){
        res.status(400).json({error:error.message});
    }
}