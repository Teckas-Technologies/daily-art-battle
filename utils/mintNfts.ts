import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import { serverMint } from "./serverMint";
import { participationMint,connectAccount } from "./participationMint";
import spinner from "./spinnerUtils";
import uploadArweave from "./uploadArweave";
import {  execute,  transfer,TransferArgs  } from "@mintbase-js/sdk"
import { ART_BATTLE_CONTRACT } from "@/config/constants";
import User from "../model/User";
import Transactions from "../model/Transactions";
import { PARTICIPANT, SPECIAL_WINNER } from "@/config/points";
import RaffleTicket from "../model/RaffleTicket";

interface Transfer {
  receiverId: string;
  tokenId:string;
}

export const mintNfts = async (): Promise<void> => {
    await connectToDatabase();
    console.log("Minting nft");
    const battles = await Battle.find({
        isNftMinted: false,
        isBattleEnded: true
    }); 
    for(const battle of battles){
    console.log(battle);
    console.log("Fetching completed battles",battle);
    if(battle){
      if(battle.isSpecialWinnerMinted==false){
        const artAvoters = await RaffleTicket.find({artId:battle.artAId});
        const artBvoters = await RaffleTicket.find({artId:battle.artBId});
        const combinedVoters = [...artAvoters, ...artBvoters];
        if(combinedVoters.length>0){
        const voters = combinedVoters.flatMap((voter) =>
          Array(voter.raffleCount).fill(voter.email)
      );  
      const specialWinner = selectRandomWinner(voters);
      console.log(specialWinner);
      if(specialWinner){
        const user = await User.findOne({email:specialWinner});
        if(!user){
         throw Error("User profile not found");
        }
      await User.updateOne({ email:specialWinner }, { $inc: { gfxCoin: SPECIAL_WINNER } });
      console.log(user);
      const newTransaction = new Transactions({
        email: user.email,
        gfxCoin: SPECIAL_WINNER,  
        transactionType: "received"  
      });
      await newTransaction.save();
        battle.specialWinner = specialWinner; 
        battle.isNftMinted = true;
        battle.isSpecialWinnerMinted = true;
       const res =  await battle.save();
       console.log("saved",res);
    }
  }
        }
    }
  }
}

const selectRandomWinner = (votes: any[]): any => {
    if (votes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * votes.length);
    return votes[randomIndex];
};
