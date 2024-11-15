import { NextApiRequest, NextApiResponse } from "next";
import { graphQLService } from "@/data/graphqlService";
import { FETCH_FEED } from "@/data/queries/feed.graphql";
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import { connectToDatabase } from "../../utils/mongoose";
import { TOTAL_REWARDS } from "@/data/queries/totalrewards.graphql";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
    const email = await authenticateUser(req);
    await connectToDatabase();
    // To fetch users nft both spinners and participation nft
    if(req.method=='GET'){
        try{
        const queryType = req.query.queryType;
        const {limit = 10, offset = 0 } = req.query;
        if(queryType=='spinners'){
            const user = await User.findOne({email});
            if(!user){
              res.status(400).json({error:"user not found"});
            }
            const owner = user.nearAddress
            const result = await graphQLService({
                query: FETCH_FEED,
                variables: {
                  nft_contract_id:SPECIAL_WINNER_CONTRACT,
                  owner,  
                  limit: parseInt(limit as string),
                  offset: parseInt(offset as string),
                },
                network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
              });
              const totalDocuments = await graphQLService({
                query: TOTAL_REWARDS,
                variables: {
                  nft_contract_ids: [SPECIAL_WINNER_CONTRACT],
                  owner,
                },
                network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
              });
              return res.status(200).json({result,totalDocuments});
        }else{
            const user = await User.findOne({email});
            if(!user){
              res.status(400).json({error:"user not found"});
            }
            const owner = user.nearAddress
            const result = await graphQLService({
                query: FETCH_FEED,
                variables: {
                  nft_contract_id: ART_BATTLE_CONTRACT,
                  owner,
                  limit: parseInt(limit as string),
                  offset: parseInt(offset as string),
                },
                network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
              });
              const totalDocuments = await graphQLService({
                query: TOTAL_REWARDS,
                variables: {
                  nft_contract_ids: [SPECIAL_WINNER_CONTRACT],
                  owner,
                },
                network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
              });
              return res.status(200).json({result,totalDocuments});
            }
           
        }
        catch(error:any){
            res.status(400).json({error:error.message});
        }
       
    }
}catch(error:any){
    res.status(400).json({error:error.message});
}
}