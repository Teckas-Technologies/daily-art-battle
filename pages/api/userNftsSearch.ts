import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import User from "../../model/User";
import { graphQLService } from "@/data/graphqlService";
import { SEARCH_ARTNAME } from "@/data/queries/searchByArtName.graph";
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from "@/config/constants";
import { SEARCH_TOTAL } from "@/data/queries/searchByArtNameCount";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        await connectToDatabase();
        const session = await getSession(req, res);
          if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }   
          const email = session.user.email;
          //To search nft based on near address
            if(req.method=='GET'){
              try {
                const queryType = req.query.queryType;
                const {title,limit = 10, offset = 0 } = req.query;
                if(queryType=="spinner"){
                const user = await User.findOne({email});
                if(!user){
                  res.status(400).json({error:"user not found"});
                }
                const owner = user.nearAddress

                const totalDocuments = await graphQLService({
                  query: SEARCH_TOTAL,
                  variables: {
                    nft_contract_ids:[SPECIAL_WINNER_CONTRACT],
                    owner,
                    title,
                  },
                  network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
                });

                const result = await graphQLService({
                    query: SEARCH_ARTNAME,
                    variables: {
                      nft_contract_id:SPECIAL_WINNER_CONTRACT,
                      title:title,
                      owner,  
                      limit: parseInt(limit as string),
                      offset: parseInt(offset as string),
                    },
                    network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
                  });
                 
        
                  const totalPages = Math.ceil(totalDocuments.data.mb_views_nft_tokens_aggregate.aggregate.count/ parseInt(limit as string));
                   return res.status(200).json({result,totalDocuments,totalPages});
                }else{
                    const user = await User.findOne({email});
                    if(!user){
                      res.status(400).json({error:"user not found"});
                    }

                    
                    const owner = user.nearAddress;

                    const totalDocuments = await graphQLService({
                      query: SEARCH_TOTAL,
                      variables: {
                        nft_contract_ids:[ART_BATTLE_CONTRACT],
                        owner,
                        title,
                      },
                      network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
                    });
          
                    const result = await graphQLService({
                        query: SEARCH_ARTNAME,
                        variables: {
                          nft_contract_id:ART_BATTLE_CONTRACT,
                          owner, 
                          title, 
                          limit: parseInt(limit as string),
                          offset: parseInt(offset as string),
                        },
                        network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
                      });

                      const totalPages = Math.ceil(totalDocuments.data.mb_views_nft_tokens_aggregate.aggregate.count/ parseInt(limit as string));
                      return res.status(200).json({result,totalDocuments,totalPages});
                }
              } catch (error:any) {
                res.status(400).json({error:error.message});
            }
            }
    }catch(error:any){
        res.status(400).json({error:error.message});
    }
}