import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import User from "../../model/User";
import { authenticateUser } from "../../utils/verifyToken";
import ArtTable from "../../model/ArtTable";
import RaffleTicket from "../../model/RaffleTicket";
import { graphQLService } from "@/data/graphqlService";
import { TOTAL_REWARDS } from "@/data/queries/totalrewards.graphql";
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import { validateUser } from "../../utils/validateClient";
import Battle from "../../model/Battle";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  // This api to fetch leaderboard list 
    if(req.method=='GET'){
        try{  
        await validateUser(req);
        await connectToDatabase();
        const queryType = req.query.queryType;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        if(queryType=="points"){
            const skip = limit * (page === 1 ? 0 : page - 1);
            const totalDocuments = await User.countDocuments({}, { firstName: 1, lastName: 1, gfxCoin: 1 });
            const totalPages = Math.ceil(totalDocuments / limit);
            const users = await User.find({}, { firstName: 1, lastName: 1, gfxCoin: 1,email:1, profileImg:1, }).sort({ gfxCoin: -1 }).skip(skip).limit(limit);
            const leaders = users.map((user, index) => ({
                firstName: user.firstName,
                lastName: user.lastName,
                gfxvsCoins: user.gfxCoin,
                email:user.email,
                profileImg:user.profileImg,
                rank: skip + index + 1 
            }));
        res.status(200).json({data:leaders,totalDocuments,totalPages});
        }else if(queryType=="collectors"){
            const skip = limit * (page === 1 ? 0 : page - 1);
            const totalDocumentsResult = await RaffleTicket.aggregate([
              { $group: { _id: "$email" } },
              { $count: "total" } 
          ]);
          const totalDocuments = totalDocumentsResult[0]?.total || 0;
          const totalPages = Math.ceil(totalDocuments / limit);
          const results = await Battle.aggregate([
            // Combine all voters into a single array
            {
              $project: {
                voters: { $concatArrays: ["$artAvoters", "$artBvoters"] },
                specialWinner: "$specialWinner",
              },
            },
        
            // Unwind voters array to count participation
            { $unwind: "$voters" },
        
            // Group by voter email to calculate participation and special wins
            {
              $group: {
                _id: "$voters", // Group by voter (email or unique identifier)
                participationCount: { $sum: 1 },
                rareNftCount: {
                  $sum: {
                    $cond: [{ $eq: ["$specialWinner", "$voters"] }, 1, 0],
                  },
                },
              },
            },
        
            // Sort by participation and special wins in descending order
            {
              $sort: { participationCount: -1, rareNftCount: -1 },
            },

            // Join with the UserTableSchema to get user details
            {
              $lookup: {
                from: "usertables", // Replace with your actual UserTable collection name
                localField: "_id",
                foreignField: "email", // Adjust based on your user schema
                as: "userDetails",
              },
            },
        
            // Unwind the user details array
            { $unwind: "$userDetails" },

            {
              $setWindowFields: {
                partitionBy: null, // Use `null` for no partitioning
                sortBy: { participationCount: -1,},
                output: {
                  rank: { $documentNumber: {} }, // Assign rank based on sorting
                },
              },  
            },
          
        
            // Project the required fields
            {
              $project: {
                firstName: "$userDetails.firstName",
                lastName: "$userDetails.lastName",
                profileImg: "$userDetails.profileImg",
                participationCount: 1,
                rareNftCount: 1,
                rank:1,
              },
            },
          ]).skip(skip).limit(limit);
              res.status(200).json({data:results,totalDocuments,totalPages});

            }else if (queryType == "creators") {
              const skip = limit * (page === 1 ? 0 : page - 1);
          
              // Fetch the total number of documents
              const totalDocumentsResult = await ArtTable.aggregate([
                  { $group: { _id: "$email" } },
                  { $count: "total" }
              ]);
              const totalDocuments = totalDocumentsResult[0]?.total || 0;
              const totalPages = Math.ceil(totalDocuments / limit);
          
              // Fetch leaderboard data with the count of arts involved in battles
              const leaderboard = await ArtTable.aggregate([
                  // Group by email to count the total uploaded arts
                  {
                      $group: {
                          _id: "$email",
                          uploadedArtCount: { $sum: 1 }
                      }
                  },
                  // Lookup user details from the UserTable
                  {
                      $lookup: {
                          from: "usertables",
                          localField: "_id",
                          foreignField: "email",
                          as: "userDetails"
                      }
                  },
                  { $unwind: "$userDetails" },
          
                  // Lookup the number of arts that have participated in battles
                  {
                      $lookup: {
                          from: "arttables",
                          let: { email: "$_id" },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: { $eq: ["$email", "$$email"] },
                                      isStartedBattle: true,
                                      isCompleted: true
                                  }
                              },
                              { $count: "battleArtCount" }
                          ],
                          as: "battleData"
                      }
                  },
                  {
                      $addFields: {
                          battleArtCount: { $ifNull: [{ $arrayElemAt: ["$battleData.battleArtCount", 0] }, 0] }
                      }
                  },
                  // Project the necessary fields
                  {
                      $project: {
                          email: "$_id",
                          firstName: "$userDetails.firstName",
                          lastName: "$userDetails.lastName",
                          profileImg: "$userDetails.profileImg",
                          uploadedArtCount: 1,
                          battleArtCount: 1
                      }
                  },
                  // Sort by the number of uploaded arts
                  { $sort: { uploadedArtCount: -1 } },
          
                  // Assign a rank based on the uploaded art count
                  {
                      $setWindowFields: {
                          partitionBy: null,
                          sortBy: { uploadedArtCount: -1 },
                          output: {
                              rank: { $documentNumber: {} }
                          }
                      }
                  }
              ])
              .skip(skip)
              .limit(limit);
          
              res.status(200).json({ data: leaderboard, totalDocuments, totalPages });          
        }
        }   
        catch(error:any){
          console.log(error.message)
            res.status(500).json({error:error.message });
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
      return {participationCount : participationCount,rareNftCount: rareNftCount};
  }