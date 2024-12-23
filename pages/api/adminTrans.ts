import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { ADMIN_GMAIL } from "@/config/constants";
import AdminTransaction from "../../model/AdminTransaction";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        if(req.method=="GET"){
            const adminEmail = req.query.email;
            if(adminEmail!=ADMIN_GMAIL){
                res.status(400).json({error:"unauthorized"});
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
             const skip = (page - 1) * limit;
              const totalDocuments = await AdminTransaction.countDocuments({});
              const totalPages = Math.ceil(totalDocuments / limit);
              const transaction = await AdminTransaction.find({}).sort({createdAt: -1}).skip(skip).limit(limit);
              return res.status(200).json({ transaction ,totalDocuments,totalPages});
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
}