import { connectToDatabase } from "./mongoose";
import ArtTable from "../model/ArtTable";
import Battle from "../model/Battle";
import Campaign from "../model/campaign";
import { GFX_CAMPAIGNID } from "@/config/constants";

export async function getNextAvailableDate(campaignId:string): Promise<Date> {
  await connectToDatabase();
  const latestBattle = await Battle.findOne({campaignId}).sort({ endTime: -1 });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!latestBattle || latestBattle.endTime < today) {
    return today;
  }

  const nextDay = new Date(latestBattle.endTime);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

export const findTopTwoArts = async (campaignId:string): Promise<any[]> => {
  await connectToDatabase();
  console.log(campaignId);
  const art = await ArtTable.aggregate([
    { $match: { isCompleted: false ,campaignId:campaignId} },  
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
  //console.log(art)
  return art;
};
export const createBattle = async (): Promise<any> => {
  await createGfxvsBattle();
  const today = new Date().toISOString().split('T')[0];
  const campaigns = await Campaign.find({
    startDate: { $lte: today },
    endDate: { $gte: today },
  });

  // Loop through each campaign sequentially
  for (const campaign of campaigns) {
    try {
      const battles = await Battle.find({ isBattleEnded: false, campaignId: campaign._id });
      const [artA, artB] = await findTopTwoArts(campaign._id.toString());

      if (battles.length === 0 && artA && artB) {
        const startDate = await getNextAvailableDate(campaign._id.toString());
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);

        const battleData = {
          campaignId: campaign._id,
          artAId: artA._id.toString(),
          artBId: artB._id.toString(),
          artAtitle: artA.arttitle,
          artBtitle: artB.arttitle,
          artAartistId: artA.artistId,
          artBartistId: artB.artistId,
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

        const newBattle = new Battle(battleData);
        const res = await newBattle.save();

        // Update artA and artB
        await ArtTable.findOneAndUpdate({ _id: artA._id }, { $set: { isStartedBattle: true } }, { new: true });
        await ArtTable.findOneAndUpdate({ _id: artB._id }, { $set: { isStartedBattle: true } }, { new: true });

        console.log('New battle created:', res);
      } else {
        console.log(`Not enough arts for campaign: ${campaign._id}`);
      }
    } catch (error) {
      console.error(`Error processing campaign ${campaign._id}:`, error);
    }
  }

  console.log('Battle creation process completed.');
};


export const createGfxvsBattle = async (): Promise<any> => {
  
  const  campaignId = GFX_CAMPAIGNID;
  const battles = await Battle.find({isBattleEnded:false,campaignId:campaignId});
  const [artA, artB] = await findTopTwoArts(campaignId);
  if(battles.length<=0 && (artA && artB)){
    const startDate = await getNextAvailableDate(campaignId);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
    const battleData = {
      campaignId : campaignId,
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
