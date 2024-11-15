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
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
            const skip = limit * (page === 1 ? 0 : page - 1);
            const totalDocuments = (await Transactions.find({email:email})).length;
            const totalPages = Math.ceil(totalDocuments / limit);
            const transaction = await Transactions.find({email:email}).skip(skip)
            .limit(limit);
            return res.status(200).json({transaction,totalPages,totalDocuments});
            }catch(error:any){
                return res.status(400).json({error});
            }
        }
    }
    catch(error:any){
        res.status(400).json({error:error.message});
    }
}