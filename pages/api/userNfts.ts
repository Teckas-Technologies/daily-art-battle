import { NextApiRequest, NextApiResponse } from "next";
import { graphQLService } from "@/data/graphqlService";
import { FETCH_FEED } from "@/data/queries/feed.graphql";
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
    const email = await authenticateUser(req);
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
              return res.status(200).json(result);
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
              return res.status(200).json(result);
            }
           
        }
        catch(error:any){
            res.status(400).json({error});
        }
       
    }
}catch(error:any){
    res.status(400).json({error:error.message});
}
}