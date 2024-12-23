import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { ADMIN_GMAIL } from "@/config/constants";
import AdminTransaction from "../../model/AdminTransaction";
import AdminBalance from "../../model/AdminBalance";
import { createTransaction } from "../../utils/updateAdminTrans";
import { AdminTransactionType } from "../../model/enum/AdminTransactionType";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        if(req.method=="GET"){
            const adminEmail = req.query.email;
            if(adminEmail!=ADMIN_GMAIL){
                res.status(400).json({error:"unauthorized"});
            }
            const balance = await AdminBalance.find({});
            res.status(200).json({balance});
        }else if(req.method=="POST"){
            const {coins,adminEmail} = req.body
            if(adminEmail!=ADMIN_GMAIL){
                res.status(400).json({error:"unauthorized"});
            }
            const deposit = new AdminBalance({
                adminEmail:adminEmail,
                total_earned:0,
                total_spent:0,
                net_balance:coins,
            })
            await deposit.save();
            const transaction = await createTransaction(coins, AdminTransactionType.ADDED_COINS,adminEmail);
            res.status(200).json({data:"Created initial  balance"});
        }
        else if(req.method=="PUT"){
            const {coins,adminEmail} = req.body
            if(adminEmail!=ADMIN_GMAIL){
                res.status(400).json({error:"unauthorized"});
            }
            const adminBalance = await AdminBalance.findOne({ adminEmail });
            if (!adminBalance) {
              return res.status(404).json({ error: "Admin balance record not found" });
            }
            adminBalance.net_balance += coins;
            await adminBalance.save();

            const transaction = await createTransaction(coins, AdminTransactionType.ADDED_COINS,adminEmail);
            res.status(200).json({data:"Created initial  balance"});
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
}