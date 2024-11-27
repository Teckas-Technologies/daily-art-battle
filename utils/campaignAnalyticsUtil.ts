import ArtTable from "../model/ArtTable"
import Battle from "../model/Battle";
import campaign from "../model/campaign";
import RaffleTicket from "../model/RaffleTicket";
import UpVoting from "../model/UpVoting";
import User from "../model/User";
import Voting from "../model/Voting";
import { connectToDatabase } from "./mongoose"

export  async function fetchTotalNftCount(campaignId:String){
    try {
     const totalNfts = await ArtTable.find({campaignId:campaignId});
     return totalNfts.length;
    } catch (error:any) {
        throw new Error(error)
    }
}

export  async function fetchTotalVotes(campaignId:String){
    try {
        const result = await Battle.aggregate([
            { $match: { campaignId: campaignId } }, 
            {
                $group: {
                    _id: null, 
                    totalArtAVotes: { $sum: "$artAVotes" },
                    totalArtBVotes: { $sum: "$artBVotes" }
                }
            }
        ]);
        const totalVotes = result.length > 0 
            ? result[0].totalArtAVotes + result[0].totalArtBVotes 
            : 0;
        return totalVotes;
       } catch (error:any) {
           throw new Error(error)
       }
}

export  async function fetchSpecialWinnerArts(campaignId:String){
    try {
        const camp = await campaign.findOne({_id:campaignId});
        const arts = await ArtTable.find({
            _id: { $in: camp.specialRewardsArtId }
        });
        return arts;

       } catch (error:any) {
           throw new Error(error)
       }
}

export  async function fetchUniqueWallets(campaignId:String){
    try {
        const voters = await RaffleTicket.find({campaignId:campaignId})
        const uniqueEmails = Array.from(new Set(voters.map(voter => voter.email)));
        const users = await User.find({ email: { $in: uniqueEmails } }, { firstName: 1, lastName: 1,email:1 });
        return users;
    } catch (error:any) {
        throw new Error(error)
    }
}


export  async function fetchUniqueWalletsWithPagination(campaignId:String,page: number, limit: number){
    try {
        const skip = limit * (page === 1 ? 0 : page - 1); 
        const voters = await RaffleTicket.find({ campaignId }).select('email');
        const uniqueEmails = Array.from(new Set(voters.map(voter => voter.email)));
        const paginatedEmails = uniqueEmails.slice(skip, skip + limit);
        const users = await User.find(
            { email: { $in: paginatedEmails } },
            { firstName: 1, lastName: 1, email: 1 } 
        );
        const totalDocuments = uniqueEmails.length;
        const totalPages = Math.ceil(totalDocuments / limit);
        return {
            users,
            totalDocuments,
            totalPages,
            currentPage: page,
        };
    } catch (error:any) {
        throw new Error(error)
    }
}

export  async function fetchTotalWallets(campaignId:String){
    try {
        const voters = await RaffleTicket.find({campaignId:campaignId})
        const uniqueEmails = Array.from(voters.map(voter => voter.email));
        const users = await User.find({ email: { $in: uniqueEmails } }, { firstName: 1, lastName: 1,email:1 });
        return users.length;
    } catch (error:any) {
        throw new Error(error)
    }
}


export async function fetchMostVotedArt(campaignId:String){
    try {
    const art = await ArtTable.find({ campaignId }).sort({ raffleTickets: -1 }).limit(1);
    return art;
    } catch (error:any) {
        throw new Error(error)
    }
}

 
export async function fetchAllUploadedArts(campaignId:String){
    try {
        const art = (await ArtTable.find({ campaignId })).length;
        return art;
        } catch (error:any) {
            throw new Error(error)
        }
}


