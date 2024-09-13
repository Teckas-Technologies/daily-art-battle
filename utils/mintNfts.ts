import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import { serverMint } from "./serverMint";
import { participationMint,connectAccount } from "./participationMint";
import spinner from "./spinnerUtils";
import uploadArweave from "./uploadArweave";
import {  execute,  transfer,TransferArgs  } from "@mintbase-js/sdk"
import { ART_BATTLE_CONTRACT } from "@/config/constants";

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
    const ress = await spinner(battle.artAcolouredArt,battle.artBcolouredArt);
    console.log("Uploading arweave")
    // const response = await uploadArweave(ress);
    battle.grayScale = 'https://arweave.net/Wkd3a8oocyNi07otNV0FAtgPIRl4jiicFksrIUqj5dg';
    battle.grayScaleReference ='https://arweave.net/TPz5baoawMaRkcv1r4n3R0XyM6gvSd4APIib9-RFbFY';
    console.log("Fetching completed battles",battle);
    if(battle){
      if(battle.artAVotes>0){
      const tokenIds =  await mintNFTsForParticipants(battle.artAVotes,battle.artAcolouredArt,battle.artAcolouredArtReference);
      await handleTransfer(tokenIds,battle.artAvoters);
      }
      if(battle.artBVotes>0){
        const tokenIds =  await mintNFTsForParticipants(battle.artBVotes,battle.artBcolouredArt,battle.artBcolouredArtReference);
        await handleTransfer(tokenIds,battle.artBvoters);
      }
      if(battle.isSpecialWinnerMinted==false){
        const voters = mergeVoters(battle.artAvoters,battle.artBvoters);
        const specialWinner = selectRandomWinner(voters);
        let tokenIdA;
        console.log("special winner",specialWinner);
        if (specialWinner) {
           console.log("Winner")
           let logs1;
              const res1 =  await serverMint(specialWinner, battle.grayScale, battle.grayScaleReference,true);
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

const mintNFTsForParticipants = async (artVoters: number, grayScale: string, grayScaleReference: string): Promise<string[]> => {
  const maxBatchSize = 99;
  const tokenIds: string[] = [];

  for (let i = 0; i < artVoters; i += maxBatchSize) {
      const batchSize = Math.min(maxBatchSize, artVoters - i);
      const batchTokenIds = await mintBatch(batchSize, grayScale, grayScaleReference);
      tokenIds.push(...batchTokenIds);
  }

  return tokenIds;
};


const mintBatch = async (artVoters:number, grayScale:string,grayScaleReference:string ) => {
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


const handleTransfer = async (tokenIds: string[], voters: string[]): Promise<void> => {
  if (tokenIds.length !== voters.length) {
      throw new Error('Arrays must be of the same length');
  }

  const maxBatchSize = 99;

  for (let i = 0; i < tokenIds.length; i += maxBatchSize) {
      const tokenChunk = tokenIds.slice(i, i + maxBatchSize);
      const voterChunk = voters.slice(i, i + maxBatchSize);

      let tokenList: Transfer[] = [];
      for (let j = 0; j < tokenChunk.length; j++) {
          let trans: Transfer = { receiverId: voterChunk[j], tokenId: tokenChunk[j] };
          tokenList.push(trans);
      }

      console.log(`Transfer batch ${i / maxBatchSize + 1}`);

      const transferArgs: TransferArgs = {
          contractAddress: ART_BATTLE_CONTRACT,
          transfers: tokenList,
      };

      const account = await connectAccount();
      await execute(
          { account: account },
          transfer(transferArgs),
      );
  }
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