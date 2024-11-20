import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import { graphQLService } from "@/data/graphqlService";
import { TOTAL_REWARDS } from "@/data/queries/totalrewards.graphql";
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import RaffleTicket from "../../model/RaffleTicket";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  
  //Here we will return users nft and arts counts
    try {
        await connectToDatabase();
        const email = await authenticateUser(req);
        if(req.method=="GET"){
            try {
              const user = await User.findOne({email});
              const owner = user.nearAddress;
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
                const rafleCount = (await RaffleTicket.find({email:email, isMintedNft: false})).length;
                return res.status(200).json({participationCount,rareNftCount,rafleCount});
            } catch (error:any) {
                res.status(400).json({error:error.message});
            }
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
}