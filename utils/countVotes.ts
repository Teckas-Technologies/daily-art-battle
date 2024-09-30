import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import Voting from '../model/Voting';
import Campaign from '../model/campaign';
import FcVoting from "../model/FcVoting";


export const countVotes = async (): Promise<void> => {
    await connectToDatabase();
    const battles = await Battle.find({
       endTime: { $lt: new Date() },
        isBattleEnded: false,
    });
    if(battles){
    for (const battle of battles) {
        console.log(battle);
        const votes = await Voting.find({ battleId: battle.id});
        const artAVotes = votes.filter(vote => vote.votedFor === 'Art A');
        const artBVotes = votes.filter(vote => vote.votedFor === 'Art B');

        const fc_votes = await FcVoting.find({ battleId: battle.id });
        const artAfcVotes = fc_votes.filter(vote => vote.votedFor === 'Art A');
        const artBfcVotes = fc_votes.filter(vote => vote.votedFor === 'Art B');

        console.log(`artAVotes:${artAVotes.length},artAfcVotes:${artAfcVotes.length},`)
        console.log(`artAVotes:${artBVotes.length},artAfcVotes:${artBfcVotes.length},`)

        const totalArtAVotes = artAVotes.length + artAfcVotes.length;
        const totalArtBVotes = artBVotes.length + artBfcVotes.length;

        console.log(`totalArtAVotes:${totalArtAVotes},totalArtBVotes:${totalArtBVotes},`)

        const winningArt = totalArtAVotes >= totalArtBVotes ? 'Art A' : 'Art B';

        console.log(artAVotes.map(vote => vote.participantId));
        console.log(artBVotes.map(vote => vote.participantId));
        // Update battle information
        battle.artAVotes = totalArtAVotes;
        battle.artBVotes = totalArtBVotes;
        battle.isBattleEnded = true;
        battle.winningArt = winningArt;
        battle.totalVotes = votes.length;
        battle.artAvoters = artAVotes.map(vote => vote.participantId);
        battle.artBvoters = artBVotes.map(vote => vote.participantId);
        console.log(battle.artBvoters);
       const res =  await battle.save();
       console.log("saved",res);
       await ArtTable.findOneAndUpdate(
        { _id: battle.artAId }, 
        { $set: { isCompleted: true,
         votes:artAVotes.length,
         battleTime:battle.startTime,
         endTime:battle.endTime
            
         } }, 
        { new: true } 
      );

      await ArtTable.findOneAndUpdate(
        { _id: battle.artBId }, 
        { $set: { isCompleted: true,
          votes:artBVotes.length,
          battleTime:battle.startTime,
          endTime:battle.endTime } }, 
        { new: true } 
      );
        console.log("Art A Votes:", artAVotes.length);
        console.log("Art B Votes:", artBVotes.length);
    }
}
};

