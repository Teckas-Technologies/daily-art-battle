import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import {fetchTotalNftCount,fetchTotalUpVotes,fetchTotalVotes,fetchUniqueWallets,fetchMostUpVotedArt,fetchMostVotedArt} from "../../utils/campaignAnalyticsUtil";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        const email = await authenticateUser(req);
        if(req.method=='GET'){
            const campaignId = req.query.id;
            // const totalNfts = await fetchTotalNftCount(campaignId as String);
            const totalVote = await fetchTotalVotes(campaignId as String);
            const totalUpVotes = await fetchTotalUpVotes(campaignId as String);
            const uniqueWallets = await fetchUniqueWallets(campaignId as  String);
            const totalUniqueWallets = uniqueWallets?.length;
            const mostVotedArt = await fetchMostVotedArt(campaignId as String);
            const mostUpVotedArt = await fetchMostUpVotedArt(campaignId as String);
            return res.status(200).json({totalVote,totalUpVotes,totalUniqueWallets,uniqueWallets,mostVotedArt,mostUpVotedArt});
        }
    } catch (error:any) {
        return res.status(400).json({error:error.message});
    }
}