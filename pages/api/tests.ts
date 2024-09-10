import { NextApiRequest, NextApiResponse } from "next";
import { graphQLService } from "@/data/graphqlService";
import { ACCOUNT_DATE } from "@/data/queries/accountDate.graphql";
import { FETCH_FEED } from "@/data/queries/feed.graphql";
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    if(req.method=='GET'){
      const posts = await graphQLService({
        query: FETCH_FEED,
        variables: { nft_contract_id:"artbattle.mintspace2.testnet" ,owner:"scalability-vega.testnet",offset:200,limit:10},
        network: "testnet"
      });
      console.log(posts);
    res.status(200).json({posts});
    }
}