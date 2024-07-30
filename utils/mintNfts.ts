import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import { serverMint } from "./serverMint";
import spinner from "./spinnerUtils";
import uploadArweave from "./uploadArweave";
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
        console.log(battle);
        await mintNFTsForParticipants(battle.artAvoters,battle.grayScale,battle.grayScaleReference);
       await mintNFTsForParticipants(battle.artBvoters,battle.grayScale,battle.grayScaleReference);
        const artAspecialWinner = selectRandomWinner(battle.artAvoters);
        const artBspecialWinner = selectRandomWinner(battle.artBvoters);
        let tokenIdA ;
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
        console.log(battle);
       const res =  await battle.save();
       console.log("saved",res);
    }
}

// export const mintNfts = async (): Promise<void> => {
//     console.log("Starting to mint NFTs...");
//     try {
//         await connectToDatabase();
//         console.log("Connected to database, now minting NFT...");
//         const battle = await Battle.findOne({
//             isNftMinted: false,
//             isBattleEnded: true
//         });
//         if (!battle) {
//             console.log("No battle found that meets the criteria.");
//             return; // If no battle is found, exits the function
//         }
//         console.log("Fetched battle:", battle);
//         // If there are additional steps, log them similarly
//     } catch (error) {
//         console.error("Error in mintNfts:", error);
//     }
// };

const mintNFTsForParticipants = async (artVoters: string[], grayScale:string,grayScaleReference:string ) => {
    for (const vote of artVoters) {
        await serverMint(vote, grayScale, grayScaleReference, false);
    }
    console.log("minted");
};


const selectRandomWinner = (votes: any[]): any => {
    if (votes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * votes.length);
    return votes[randomIndex];
};