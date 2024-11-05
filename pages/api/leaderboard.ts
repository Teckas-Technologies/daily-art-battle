import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import { authenticateUser } from "../../utils/verifyToken";
import ArtTable from "../../model/ArtTable";
import RaffleTicket from "../../model/RaffleTicket";
import { graphQLService } from "@/data/graphqlService";
import { TOTAL_REWARDS } from "@/data/queries/totalrewards.graphql";
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method=='GET'){
        try{
        const email = await authenticateUser(req);    
        await connectToDatabase();
        const queryType = req.query.queryType;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        if(queryType=="points"){
            const skip = limit * (page === 1 ? 0 : page - 1);
            const users = await User.find({}, { firstName: 1, lastName: 1, gfxCoin: 1 }).sort({ gfxCoin: -1 }).skip(skip).limit(limit);
            const leaders = users.map((user, index) => ({
                firstName: user.firstName,
                lastName: user.lastName,
                gfxvsCoins: user.gfxCoin,
                rank: index + 1 
            }));
        res.status(200).json({data:leaders});
        }else if(queryType=="collectors"){
            const skip = limit * (page === 1 ? 0 : page - 1);
            const leaderboard = await RaffleTicket.aggregate([
                {
                  $group: {
                    _id: "$email",                // Group by email to count tickets per user
                    raffleTicketCount: { $sum: 1 } // Count raffle tickets for each user
                  }
                },
                {
                  $lookup: {
                    from: "usertables",           // The UserTable collection name in MongoDB
                    localField: "_id",            // Email field from RaffleTicket
                    foreignField: "email",        // Email field in UserTable
                    as: "userDetails"
                  }
                },
                {
                  $unwind: "$userDetails"         // Deconstruct userDetails array
                },
                {
                  $project: {
                    email: "$_id",
                    firstName: "$userDetails.firstName",
                    lastName: "$userDetails.lastName",
                    gfxCoin: "$userDetails.gfxCoin",
                    nearAddress: "$userDetails.nearAddress",
                    raffleTicketCount: 1
                  }
                },
                {
                  $sort: { raffleTicketCount: -1 } 
                },
                {
                    $setWindowFields: {
                      partitionBy: null, // Apply to all documents as a single partition
                      sortBy: { uploadedArtCount: -1 },
                      output: {
                        rank: { $rank: {} } // Assigns rank based on sort order
                      }
                    }
                }
              ]).skip(skip).limit(limit);
              const leaderboardWithRewards = await Promise.all(
                leaderboard.map(async (user) => {
                  const {participationCount,rareNftCount} = await getUserRewards(user.nearAddress);
                  return {
                    ...user,
                    participationCount,rareNftCount,
                  };
                })
              );
              res.status(200).json({data:leaderboardWithRewards});
        }else if(queryType=="creators"){
            const skip = limit * (page === 1 ? 0 : page - 1);
            const leaderboard = await ArtTable.aggregate([
                {
                  $group: {
                    _id: "$email",              
                    uploadedArtCount: { $sum: 1 }
                  }
                },
                {
                  $lookup: {
                    from: "usertables",        
                    localField: "_id",          
                    foreignField: "email",      
                    as: "userDetails"
                  }
                },
                {
                  $unwind: "$userDetails"       
                },
                {
                  $project: {
                    email: "$_id",
                    firstName: "$userDetails.firstName",
                    lastName: "$userDetails.lastName",
                    uploadedArtCount: 1
                  }
                },
                {
                  $sort: { uploadedArtCount: -1 } 
                },
                {
                    $setWindowFields: {
                      partitionBy: null, // Apply to all documents as a single partition
                      sortBy: { uploadedArtCount: -1 },
                      output: {
                        rank: { $rank: {} } // Assigns rank based on sort order
                      }
                    }
                }
              ]).skip(skip).limit(limit);

              res.status(200).json({data:leaderboard});
            
        }
        }   
        catch(error:any){
            res.status(500).json({error});
        }
    }
} 

async function getUserRewards(owner: string) {
   const participationCount =  await graphQLService({
      query: TOTAL_REWARDS,
      variables: {
        nft_contract_ids: [ART_BATTLE_CONTRACT],
        owner,
      },
      network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
    });
    const rareNftCount = await graphQLService({
        query: TOTAL_REWARDS,
        variables: {
          nft_contract_ids: [SPECIAL_WINNER_CONTRACT],
          owner,
        },
        network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
      });
      return {participationCount,rareNftCount};
  }