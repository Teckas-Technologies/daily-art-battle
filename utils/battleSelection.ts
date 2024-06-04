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
  const arts = await ArtTable.find({isStartedBattle:false}).sort({ upVotes: -1 }).limit(2).exec();
  return arts;
};

export const createBattle = async (): Promise<any> => {
  const [artA, artB] = await findTopTwoArts();
  if (artA && artB) {
     const existingBattleWithArtA = await Battle.findOne({ $or: [{ artAId: artA._id }, { artBId: artA._id }] });
    const existingBattleWithArtB = await Battle.findOne({ $or: [{ artAId: artB._id }, { artBId: artB._id }] });
    if (existingBattleWithArtA || existingBattleWithArtB) {
     console.log("One or both of the selected artworks are already in a battle");
    }else{ 
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
      artAgrayScale: artA.grayScale,
      artBgrayScale: artB.grayScale,
      artAcolouredArt: artA.colouredArt,
      artBcolouredArt: artB.colouredArt,
      artAgrayScaleReference: artA.grayScaleReference,
      artBgrayScaleReference: artB.grayScaleReference,
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
   await Promise.all([ArtTable.updateOne({ _id: artA._id }, { isStartedBattle: true }), ArtTable.updateOne({ _id: artB._id }, { isStartedBattle: true })]);
   console.log(res);
    return newBattle;
  } 
}else {
  console.log("Not enough artworks to create a battle");
 }
};
