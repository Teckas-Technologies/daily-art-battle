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
        const voters = combinedVoters.flatMap((voter) =>
          Array(voter.raffleCount).fill(voter.participantId)
      );  
        const specialWinner = selectRandomWinner(voters);
        let tokenIdA;
        console.log("special winner",specialWinner);
        if (specialWinner) {
           console.log("Winner")
           let logs1;
              const res1 =  await serverMint(specialWinner,battle.grayScale, battle.grayScaleReference,true);
              logs1 =  res1.receipts_outcome.map((outcome :any)=> outcome.outcome.logs).flat();
         
           if(logs1){
           const tokenIds1 = logs1.map((log:any) => {
            const match = log.match(/EVENT_JSON:(.*)/);
            if (match && match[1]) {
              const eventData = JSON.parse(match[1]);
              if (eventData.data && eventData.data.length > 0) {
                return eventData.data[0].token_ids;
              }
            }
            return null;
          }).filter((tokenIds:any) => tokenIds !== null).flat();
          
          console.log('Token IDs:', tokenIds1);
          tokenIdA = tokenIds1[0];
        }
      }
      await User.updateOne({ nearAddress:specialWinner }, { $inc: { gfxCoin: SPECIAL_WINNER } });
      const user = await User.findOne({nearAddress:specialWinner});
      const newTransaction = new Transactions({
        email: user.email,
        gfxCoin: SPECIAL_WINNER,  
        transactionType: "received"  
      });
      await newTransaction.save();

        battle.specialWinner = specialWinner;
        battle.isNftMinted = true;
        battle.isSpecialWinnerMinted = true;
        battle.tokenId = tokenIdA;
       const res =  await battle.save();
       console.log("saved",res);
        }
    }
  }
}

const selectRandomWinner = (votes: any[]): any => {
    if (votes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * votes.length);
    return votes[randomIndex];
};
