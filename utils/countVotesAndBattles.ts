import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import Voting from '../model/Voting';
import { serverMint } from "./serverMint";

export const countVotesAndUpdateBattle = async (): Promise<void> => {
    await connectToDatabase();
    const battles = await Battle.find({
       endTime: { $lt: new Date() },
        isBattleEnded: false
    });
    if(battles){
    for (const battle of battles) {
        const votes = await Voting.find({ battleId: battle.id });
        const artAVotes = votes.filter(vote => vote.votedFor === 'ArtA');
        const artBVotes = votes.filter(vote => vote.votedFor === 'ArtB');
        const winningArt = artAVotes.length >= artBVotes.length ? 'ArtA' : 'ArtB';
        const winningVotes = winningArt === 'ArtA' ? artAVotes : artBVotes;

        // Mint NFTs for all participants
        await mintNFTsForParticipants(votes, battle);
        // Select and mint for a special winner
        const specialWinner = selectRandomWinner(winningVotes);
        if (specialWinner) {
           
            const coloredArt = winningArt === 'ArtA' ? battle.artAcolouredArt : battle.artBcolouredArt;
            const coloredArtReference = winningArt === 'ArtA' ? battle.artAcolouredArtReference : battle.artBcolouredArtReference;
            await serverMint(specialWinner.participantId, coloredArt, coloredArtReference,true);
        }

        // Update battle information
        battle.artAVotes = artAVotes.length;
        battle.artBVotes = artBVotes.length;
        battle.winningArt = winningArt;
        battle.specialWinner = specialWinner?.participantId;
        battle.isBattleEnded = true;
        battle.isNftMinted = true;
       const res =  await battle.save();
       await ArtTable.findOneAndUpdate(
        { _id: battle.artAId }, 
        { $set: { isCompleted: true } }, 
        { new: true } 
      );

      await ArtTable.findOneAndUpdate(
        { _id: battle.artBId }, 
        { $set: { isCompleted: true } }, 
        { new: true } 
      );
        console.log("Art A Votes:", artAVotes.length);
        console.log("Art B Votes:", artBVotes.length);
        console.log("Random Winner:", specialWinner?.participantId);
    }
}
};

const mintNFTsForParticipants = async (votes: any[], battle: any) => {
    for (const vote of votes) {
        const grayScale = (vote.votedFor == "ArtA")?battle.artAgrayScale: battle.artBgrayScale;
        const grayScaleReference = (vote.votedFor == "ArtA")?battle.artAgrayScaleReference:battle.artBgrayScaleReference;
        await serverMint(vote.participantId, grayScale, grayScaleReference, false);
    }
};


const selectRandomWinner = (votes: any[]): any => {
    if (votes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * votes.length);
    return votes[randomIndex];
};
