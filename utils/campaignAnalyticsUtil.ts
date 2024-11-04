import ArtTable from "../model/ArtTable"
import Battle from "../model/Battle";
import campaign from "../model/campaign";
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


export  async function fetchTotalUpVotes(campaignId:String){
    try {
        const result = await ArtTable.aggregate([
            { $match: { campaignId: campaignId } }, 
            {
                $group: {
                    _id: null, 
                    totalUpVotes: { $sum: "$upVotes" }
                }
            }
        ]);
        return result.length > 0 ? result[0].totalUpVotes : 0;
       } catch (error:any) {
           throw new Error(error)
       }
}

export  async function fetchUniqueWallets(campaignId:String){
    try {
        const upvoters = await UpVoting.find({ campaignId }, { email: 1 });
        const voters = await Voting.find({campaignId}, { email: 1 })
        const combinedVoters = [...upvoters, ...voters];
        const uniqueEmails = Array.from(new Set(combinedVoters.map(voter => voter.email)));
        const users = await User.find({ email: { $in: uniqueEmails } }, { firstName: 1, lastName: 1,email:1 });
        return users;
    } catch (error:any) {
        throw new Error(error)
    }
}

export async function fetchMostVotedArt(campaignId:String){
    try {
    const art = await ArtTable.find({ campaignId }).sort({ votes: -1 }).limit(1);
    return art;
    } catch (error:any) {
        throw new Error(error)
    }
}
export async function fetchMostUpVotedArt(campaignId:String){
    try{
    const art = await ArtTable.find({ campaignId }).sort({ upVotes: -1 }).limit(1);
    return art;
    }
    catch(error:any){
        throw new Error(error)
    }
}
 


