import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import { serverMint } from "./serverMint";
import { participationMint,connectAccount } from "./participationMint";
import spinner from "./spinnerUtils";
import uploadArweave from "./uploadArweave";
import {  execute,  transfer,TransferArgs  } from "@mintbase-js/sdk"

interface Transfer {
  receiverId: string;
  tokenId:string;
}

export const mintNfts = async (): Promise<void> => {
    await connectToDatabase();
    console.log("Minting nft");
    const battle = await Battle.findOne({
        isNftMinted: false,
        isBattleEnded: true
    });
    const ress = await spinner();
    console.log("Uploading arweave")
    const response = await uploadArweave(ress);
    battle.grayScale = response.url;
    battle.grayScaleReference = response.referenceUrl;
    console.log("Fetching completed battles",battle);
    if(battle){
      const votes = battle.artAVotes+battle.artBVotes;
      if(votes>0){
      const tokenIds =  await mintNFTsForParticipants(votes,battle.grayScale,battle.grayScaleReference);
      const voters = await mergeVoters(battle.artAvoters,battle.artBvoters);
      await handleTransfer(tokenIds,voters);
      }
  
      if(battle.isSpecialWinnerMinted==false){
        const artAspecialWinner = selectRandomWinner(battle.artAvoters);
        const artBspecialWinner = selectRandomWinner(battle.artBvoters);
        let tokenIdA;
        let tokenIdB;
        console.log("art A",artAspecialWinner);
        console.log("art B",artBspecialWinner);
        if (artAspecialWinner || artBspecialWinner) {
           console.log("Winner")
           let logs1;
           let logs2;
           if(artAspecialWinner){
              const res1 =  await serverMint(artAspecialWinner, battle.artAcolouredArt, battle.artAcolouredArtReference,true);
              logs1 =  res1.receipts_outcome.map((outcome :any)=> outcome.outcome.logs).flat();
            }
           if(artBspecialWinner){
             const  res2 =  await serverMint(artBspecialWinner, battle.artBcolouredArt, battle.artBcolouredArtReference,true);
             logs2 = res2.receipts_outcome.map((outcome :any)=> outcome.outcome.logs).flat();
            }
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
          if(logs2){
           const tokenIds2 = logs2.map((log:any) => {
            const match = log.match(/EVENT_JSON:(.*)/);
            if (match && match[1]) {
              const eventData = JSON.parse(match[1]);
              if (eventData.data && eventData.data.length > 0) {
                return eventData.data[0].token_ids;
              }
            }
            return null;
          }).filter((tokenIds:any) => tokenIds !== null).flat();
          
          console.log('Token IDs:', tokenIds2[0]);
          tokenIdB = tokenIds2[0];
        }
      }
        battle.artAspecialWinner = artAspecialWinner;
        battle.artBspecialWinner = artBspecialWinner;

        await ArtTable.findOneAndUpdate(
            { _id: battle.artAId }, 
            { $set: { isCompleted: true,
                specialWinner:artAspecialWinner  ,
                tokenId : tokenIdA
             } }, 
            { new: true } 
          );
    
          await ArtTable.findOneAndUpdate(
            { _id: battle.artBId }, 
            { $set: { isCompleted: true,
                specialWinner:artBspecialWinner,
                tokenId : tokenIdB
               } }, 
            { new: true } 
          );
        battle.isNftMinted = true;
        battle.isSpecialWinnerMinted = true;
       const res =  await battle.save();
       console.log("saved",res);
        }
    }
}

const mintNFTsForParticipants = async (artVoters:number, grayScale:string,grayScaleReference:string ) => {
        const  res =   await participationMint(artVoters, grayScale, grayScaleReference, false);
       let logs = res.receipts_outcome.map((outcome :any)=> outcome.outcome.logs).flat();
       const tokenIds = logs.map((log:any) => {
        const match = log.match(/EVENT_JSON:(.*)/);
        if (match && match[1]) {
          const eventData = JSON.parse(match[1]);
          if (eventData.data && eventData.data.length > 0) {
            return eventData.data[0].token_ids;
          }
        }
        return null;
      });
      console.log(tokenIds[0]);
     return tokenIds[0];
};


const handleTransfer = async (tokenIds:string[],voters:string[]): Promise<void> => {
  if (tokenIds.length !== voters.length) {
    throw new Error('Arrays must be of the same length');
  }

    let tokenList: Transfer[] = [];

    for (let i = 0; i < tokenIds.length; i++) {
        let trans: Transfer = { receiverId: voters[i], tokenId: tokenIds[i] };
        tokenList.push(trans);
    }

       console.log("tranfer")
      const transferArgs: TransferArgs = {
      contractAddress: "artbattle.mintspace2.testnet",
      transfers: tokenList,
    }
    const account = await connectAccount();
  await execute(
    { account:account},
    transfer(transferArgs),
  );
};


const selectRandomWinner = (votes: any[]): any => {
    if (votes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * votes.length);
    return votes[randomIndex];
};

      const mergeVoters = (votersA: any[],votersB:any[]): any => {
          const voters:any[] = [];
          for(const voter of votersA){
            voters.push(voter);
          }
          for(const voter of votersB){
            voters.push(voter);
          }

          return voters
      };