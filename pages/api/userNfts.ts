import { NextApiRequest, NextApiResponse } from "next";
import { graphQLService } from "@/data/graphqlService";
import { FETCH_FEED } from "@/data/queries/feed.graphql";
import { NEXT_PUBLIC_NETWORK } from "@/config/constants";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
    const email = await authenticateUser(req);
    if(req.method=='GET'){
        try{
        const { nft_contract_id, limit = 10, offset = 0 } = req.query;
        const user = await User.findOne({email});
        const owner = user.nearAddress
        if (!nft_contract_id) {
            return res.status(400).json({ error: 'Missing required parameters: nft_contract_id or owner' });
        }

        const result = await graphQLService({
            query: FETCH_FEED,
            variables: {
              nft_contract_id,
              owner,
              limit: parseInt(limit as string, 10),
              offset: parseInt(offset as string, 10),
            },
            network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
          });
          return res.status(200).json(result.data);
        }
        catch(error:any){
            res.status(400).json({error});
        }
    }
}catch(error:any){
    res.status(400).json({error:error.message});
}
}