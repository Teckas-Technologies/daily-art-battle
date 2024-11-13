import { connectToDatabase } from "./mongoose";
import Battle from '../model/Battle';
import ArtTable from '../model/ArtTable';
import Voting from '../model/Voting';
import Campaign from '../model/campaign';
import RaffleTicket from "../model/RaffleTicket";


export const countVotes = async (): Promise<void> => {
    await connectToDatabase();
    const battles = await Battle.find({
       endTime: { $lt: new Date() },
        isBattleEnded: false,
    });
    if(battles){
    for (const battle of battles) {
        console.log(battle);
       const artA = await ArtTable.findOne({_id:battle.artAId});
       const artB = await ArtTable.findOne({_id:battle.artBId});
        const artAVotes = artA.raffleTickets;
        const artBVotes = artB.raffleTickets;

        const winningArt = artAVotes >= artBVotes ? 'Art A' : 'Art B';
        // Update battle information
        battle.artAVotes = artAVotes;
        battle.artBVotes = artBVotes;
        battle.isBattleEnded = true;
        battle.winningArt = winningArt;
        battle.totalVotes = artAVotes + artBVotes;
        const artARaffleVoters = await RaffleTicket.find({artId:battle.artAId});
        const artBRaffleVoters = await RaffleTicket.find({artId:battle.artBId});
        battle.artAvoters = artARaffleVoters.map(voter => voter.email);
        battle.artBvoters = artBRaffleVoters.map(voter => voter.email);
        console.log(battle.artBvoters);
       const res =  await battle.save();
       console.log("saved",res);
       await ArtTable.findOneAndUpdate(
        { _id: battle.artAId }, 
        { $set: { isCompleted: true,
         battleTime:battle.startTime,
         endTime:battle.endTime
         } }, 
        { new: true } 
      );

      await ArtTable.findOneAndUpdate(
        { _id: battle.artBId }, 
        { $set: { isCompleted: true,
          battleTime:battle.startTime,
          endTime:battle.endTime } }, 
        { new: true } 
      );
        console.log("Art A Votes:", artAVotes);
        console.log("Art B Votes:", artBVotes);
    }
}
};

