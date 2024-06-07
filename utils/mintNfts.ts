import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import { serverMint } from "./serverMint";

export const mintNfts = async (): Promise<void> => {
    await connectToDatabase();
    console.log("Minting nft");
    const battle = await Battle.findOne({
        isNftMinted: false,
        isBattleEnded: true
    });
      console.log("Fetching completed battles",battle);
    if(battle){
        console.log(battle);
        await mintNFTsForParticipants(battle.artAvoters,battle.artAgrayScale,battle.artAgrayScaleReference);
        await mintNFTsForParticipants(battle.artBvoters,battle.artBgrayScale,battle.artBgrayScaleReference);
        const artAspecialWinner = selectRandomWinner(battle.artAvoters);
        const artBspecialWinner = selectRandomWinner(battle.artBvoters);
        console.log("art A",artAspecialWinner);
        console.log("art B",artBspecialWinner);
        if (artAspecialWinner && artBspecialWinner) {
           console.log("Winner")
            await serverMint(artAspecialWinner, battle.artAcolouredArt, battle.artAcolouredArtReference,true);
            await serverMint(artBspecialWinner, battle.artBcolouredArt, battle.artBcolouredArtReference,true);
        }
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
