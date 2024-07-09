import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import Voting from '../model/Voting';
import runProcess from "./generateImage";
export const countVotes = async (): Promise<void> => {
    await connectToDatabase();
    const battles = await Battle.find({
       endTime: { $lt: new Date() },
        isBattleEnded: false
    });
    if(battles){
    for (const battle of battles) {
        console.log(battle);
        const votes = await Voting.find({ battleId: battle.id });
        const artAVotes = votes.filter(vote => vote.votedFor === 'Art A');
        const artBVotes = votes.filter(vote => vote.votedFor === 'Art B');
        const winningArt = artAVotes.length >= artBVotes.length ? 'Art A' : 'Art B';
        console.log(artAVotes.map(vote => vote.participantId));
        console.log(artBVotes.map(vote => vote.participantId));
        if(winningArt==='Art A'){
        const result =   await runProcess(battle.artAcolouredArt,battle.artBcolouredArt,battle.artAtitle,battle.artBartistId,battle.artAartistId);
        battle.grayScale = result?.url;
        battle.grayScaleReference = result?.referenceUrl;
        }else if(winningArt==='Art B'){
          const result =   await runProcess(battle.artBcolouredArt,battle.artAcolouredArt,battle.artBtitle,battle.artAartistId,battle.artBartistId);
          battle.grayScale = result?.url;
          battle.grayScaleReference = result?.referenceUrl;
        }
        // Update battle information
        battle.artAVotes = artAVotes.length;
        battle.artBVotes = artBVotes.length;
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

