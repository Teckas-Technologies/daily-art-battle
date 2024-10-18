//vote.ts is used to create votes for the arts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import Voting from '../../model/Voting';
import JwtPayload, { authenticateUser } from '../../utils/verifyToken';
import { verifyToken } from '../../utils/verifyToken';
import User from '../../model/User';
import { ART_VOTE } from '@/config/points';
import Transactions from '../../model/Transactions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  try{
    const email = await authenticateUser(req);
  if (req.method === 'POST') {
    try {
    const { participantId, battleId, votedFor,campaignId, fcId } = req.body;

    if (!participantId && !fcId) {
      return res.status(400).json({ success: false, message: "Either participantId or fcId must be provided." });
    }

    const query: any = { battleId, campaignId };
    if (participantId) {
      query.participantId = participantId;
    } else {
      query.fcId = fcId;
    }

    // Check if the participant has already voted for this battle
    const existingVote = await Voting.findOne(query);
    if (existingVote) {
      return res.status(400).json({ success: false, message: "Participant has already voted for this battle." });
    }


    // Create a new vote
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    if(user.nearAddress!=participantId){
      return res
      .status(404)
      .json({ success: false, error: "User wallet address not matched" });
    }


    // Check if the user has enough gfxCoin to vote
    if (user.gfxCoin < ART_VOTE) {
      return res.status(400).json({ success: false, message: "Insufficient balance to vote." });
    }
      const vote = await Voting.create({ email,participantId, battleId, votedFor ,campaignId, fcId});
      await User.updateOne(
        { email: email },
        
        { $inc: { gfxCoin: - ART_VOTE } }
      );
      const newTransaction = new Transactions({
        email: email,
        gfxCoin: ART_VOTE,  
        transactionType: "spent"  
      });
      
      await newTransaction.save();
      res.status(201).json({ success: true, data: vote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
    //GET method is used to fetch vote by participantId and battleId.
  } if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: email });
      const { participantId, battleId,campaignId, fcId } = req.query;
      if (!participantId && !fcId) {
        return res.status(400).json({ success: false, message: "Either participantId or fcId must be provided." });
      }

      if(user.nearAddress!=participantId){
        return res
        .status(404)
        .json({ success: false, error: "User wallet address not matched" });
      }
  
      const query: any = { battleId, campaignId };
      if (participantId) {
        query.participantId = participantId;
      } else {
        query.fcId = fcId;
      }
      const existingVote = await Voting.findOne(query);
      res.status(200).json({ success: true, data: existingVote });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    // res.setHeader('Allow', ['GET', 'POST']);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
catch(error:any){
  return res.status(400).json({error:error.message});
}
}
