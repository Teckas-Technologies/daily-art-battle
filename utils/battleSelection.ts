import { connectToDatabase } from "./mongoose";
import ArtTable from "../model/ArtTable";
import Battle from "../model/Battle";

export async function getNextAvailableDate(): Promise<Date> {
  await connectToDatabase();
  const latestBattle = await Battle.findOne().sort({ endTime: -1 });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!latestBattle || latestBattle.endTime < today) {
    return today;
  }

  const nextDay = new Date(latestBattle.endTime);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}
export const findTopTwoArts = async (): Promise<any[]> => {
  await connectToDatabase();
  const art = await ArtTable.aggregate([
    { $match: { isCompleted: false } },  
    { $sort: { upVotes: -1 } }, 
    {
      $group: {
        _id: "$artistId",
        topArt: { $first: "$$ROOT" }
      }
    },
    { $sort: { "topArt.upVotes": -1 } },
    { $limit: 2 },
    { $replaceRoot: { newRoot: "$topArt" } }
  ]).exec();
  return art;
};

export const createBattle = async (): Promise<any> => {
  const battles = await Battle.find({isBattleEnded:false});
  const [artA, artB] = await findTopTwoArts();
  if(battles.length<=0 && (artA && artB)){
    const startDate = await getNextAvailableDate();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
    const battleData = {
      artAId: artA._id.toString(),
      artBId: artB._id.toString(),
      artAtitle: artA.arttitle,
      artBtitle: artB.arttitle,
      artAartistId:artA.artistId,
      artBartistId:artB.artistId,
      artAcolouredArt: artA.colouredArt,
      artBcolouredArt: artB.colouredArt,
      artAcolouredArtReference: artA.colouredArtReference,
      artBcolouredArtReference: artB.colouredArtReference,
      startTime: startDate,
      endTime: endDate,
      isBattleEnded: false,
      isNftMinted: false,
      artAVotes: 0,
      artBVotes: 0,
    };
    console.log(battleData);
    const newBattle = new Battle(battleData);
   const res = await newBattle.save();

   try {
    // Updating artA
    const updateArtA = await ArtTable.findOneAndUpdate(
      { _id: artA._id }, 
      { $set: { isStartedBattle: true } }, 
      { new: true }
    );
  
    if (!updateArtA) {
      console.error(`Failed to update artA with ID: ${artA._id}`);
    } else {
      console.log(`Successfully updated artA: ${updateArtA}`);
    }
  
    // Updating artB
    const updateArtB = await ArtTable.findOneAndUpdate(
      { _id: artB._id }, 
      { $set: { isStartedBattle: true } }, 
      { new: true }
    );
  
    if (!updateArtB) {
      console.error(`Failed to update artB with ID: ${artB._id}`);
    } else {
      console.log(`Successfully updated artB: ${updateArtB}`);
    }
  } catch (error) {
    console.error("Error updating art records:", error);
  }
  
   console.log(res);
    return newBattle;
  } else{
    console.log("Not enough arts");
  }
}

