import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import {fetchTotalNftCount,fetchTotalVotes,fetchUniqueWallets,fetchUniqueWalletsWithPagination,fetchMostVotedArt,fetchAllUploadedArts, fetchSpecialWinnerArts, fetchTotalWallets} from "../../utils/campaignAnalyticsUtil";
import { validateUser } from "../../utils/validateClient";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        await validateUser(req);
        //To fetch campaign analytics details
        if(req.method=='GET'){
            const queryType = req.query.queryType;
            const campaignId = req.query.id;
            if(queryType=="participants"){
                const page = parseInt(req.query.page as string) || 1;
                const limit = parseInt(req.query.limit as string) || 10;
                const uniqueWallets = await fetchUniqueWalletsWithPagination(campaignId as  String,page,limit);
                res.status(200).json({uniqueWallets});
            }
            // const totalNfts = await fetchTotalNftCount(campaignId as String);
            const totalRaffle = await fetchTotalVotes(campaignId as String);
            const uniqueWallets = await fetchUniqueWallets(campaignId as  String);
            const totalUniqueWallets = uniqueWallets?.length;
            const totalParticipants = await fetchTotalWallets(campaignId as String);
            const mostVotedArt = await fetchMostVotedArt(campaignId as String);
            const specialWinnerArts = await fetchSpecialWinnerArts(campaignId as String);
            const totalUploadedarts = await fetchAllUploadedArts(campaignId as String);
            return res.status(200).json({totalUploadedarts,totalRaffle,totalParticipants,totalUniqueWallets,uniqueWallets,mostVotedArt,specialWinnerArts});
        }
    } catch (error:any) {
        return res.status(400).json({error:error.message});
    }
}