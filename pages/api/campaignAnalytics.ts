import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import {fetchTotalNftCount,fetchTotalVotes,fetchUniqueWallets,fetchMostVotedArt, fetchSpecialWinnerArts, fetchTotalWallets} from "../../utils/campaignAnalyticsUtil";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        const email = await authenticateUser(req);
        //To fetch campaign analytics details
        if(req.method=='GET'){
            const campaignId = req.query.id;
            // const totalNfts = await fetchTotalNftCount(campaignId as String);
            const totalRaffle = await fetchTotalVotes(campaignId as String);
            const uniqueWallets = await fetchUniqueWallets(campaignId as  String);
            const totalUniqueWallets = uniqueWallets?.length;
            const totalParticipants = await fetchTotalWallets(campaignId as String);
            const mostVotedArt = await fetchMostVotedArt(campaignId as String);
            const specialWinnerArts = await fetchSpecialWinnerArts(campaignId as String);
            return res.status(200).json({totalRaffle,totalParticipants,totalUniqueWallets,uniqueWallets,mostVotedArt,specialWinnerArts});
        }
    } catch (error:any) {
        return res.status(400).json({error:error.message});
    }
}