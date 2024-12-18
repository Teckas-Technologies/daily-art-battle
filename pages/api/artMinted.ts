import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../utils/verifyToken";
import { connectToDatabase } from "../../utils/mongoose";
import Hashes from "../../model/Hashes";
import { providers, utils } from 'near-api-js';
import { NEXT_PUBLIC_NETWORK } from "@/config/constants";
import RaffleTicket from "../../model/RaffleTicket";
import { getSession } from "@auth0/nextjs-auth0";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
         const session = await getSession(req, res);
          if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
        await connectToDatabase();
        //To validate whether is minted or not
        if(req.method=="POST"){
            const {transactionHash,raffleTicketId} = req.body;
            const existinghash = await Hashes.findOne({hash:transactionHash});
            if(existinghash){
                return res.status(500).json({error:"Hash already used"});
            }
            const provider = new providers.JsonRpcProvider({ url: `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org` });
            const transaction = await provider.txStatus(transactionHash as string, 'unused') as providers.FinalExecutionOutcome;
            if (isFinalExecutionStatusWithSuccessValue(transaction.status)) {
               const raffleTicket = await RaffleTicket.findOne({_id:raffleTicketId});
               if(raffleTicket){
               raffleTicket.isMintedNft = true;
               raffleTicket.save();
               }
            }
        }
    }catch(error:any){
        res.status(400).json({error:error.message});
    }
}

function isFinalExecutionStatusWithSuccessValue(status: any) {
    return status && typeof status.SuccessValue === 'string';
}
   
