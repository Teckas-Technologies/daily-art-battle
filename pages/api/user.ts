import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User, { UserTable } from '../../model/User';
import { REFFERED_USER, REFFERER, SIGNUP } from '@/config/points';
import { authenticateUser, verifyToken } from '../../utils/verifyToken';
import JwtPayload from '../../utils/verifyToken';
import Transactions from '../../model/Transactions';
import Voting from '../../model/Voting';
import { TOTAL_REWARDS } from '@/data/queries/totalrewards.graphql';
import { graphQLService } from '@/data/graphqlService';
import { ART_BATTLE_CONTRACT, NEXT_PUBLIC_NETWORK, SPECIAL_WINNER_CONTRACT } from '@/config/constants';
import { error } from 'console';
import RaffleTicket from '../../model/RaffleTicket';
import { TransactionType } from '../../model/enum/TransactionType';
import { getSession } from '@auth0/nextjs-auth0';
import { getManagementApiToken, getUserDetails } from '../../utils/userDetails';
import { createAuth0user, createGoogleuser } from '../../utils/userUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    //Here user will be created 
    try {
      await connectToDatabase();
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const provider = session.user.sub.split('|')[0];
    if(provider == 'google-oauth2'){
      const response = await createGoogleuser(session)
      res.status(201).json({ user: response });
    }else{
      const response = await createAuth0user(session)
      res.status(201).json({ user: response });
    }
    } catch (error:any) {
      res.status(500).json({ error:error.message });
    }
  }

  //To fetch users based on id token
  else if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const session = await getSession(req, res);
      if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    const email = session.user.email;
      console.log(email);
      const user = await User.findOne({ email: email });
      if(!user){
        return res.status(400).json({error:"User not found"})
      }
      const voting = (await RaffleTicket.find({email:email})).length; 
      const owner = user.nearAddress;
        const rewards = await graphQLService({
            query: TOTAL_REWARDS,
            variables: {
              nft_contract_ids: [ART_BATTLE_CONTRACT, SPECIAL_WINNER_CONTRACT],
              owner,
            },
            network: NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
          });
      res.status(200).json({user ,voting,rewards});
    } catch (error:any) { 
      res.status(400).json({ error:error.message });
    }
  }

  // To update user based on token
  if(req.method=='PUT'){
    try{
      await connectToDatabase();
      const session = await getSession(req, res);
  
      if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const accessToken = await getManagementApiToken();
      const userDetails = await getUserDetails(session.user.sub, accessToken);
      const email = userDetails.email;
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {  
        res.status(400).json({message:"User profile not found"});
      }
      const queryType = req.query.queryType;
      if(queryType=="update"){
        const updateData = { ...req.body };
        const updatedProfile = await User.findOneAndUpdate(
          { email },
          updateData,
          { new: true }
        );
        console.log(updatedProfile);
        res.status(200).json({ profile: updatedProfile });
      }
      // const profile = await User.findOneAndUpdate({ email }, {firstName:payload.given_name,lastName:payload.family_name}, { new: true }); 
      // res.status(200).json({profile});
    }catch(error:any){
      return res.status(400).json({error:error.message});
    }
  }
}
