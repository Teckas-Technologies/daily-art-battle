import { connectToDatabase } from "./mongoose";
import Battle from "../model/Battle";

// Fetch today battle images for farcaster
export async function fetchTodayBattle(): Promise<any[]> {
  await connectToDatabase();
  
  return Battle.find({
    campaignId: "gfxvs",
    isBattleEnded: false,
    isNftMinted: false
  }).exec();
}

export async function getNextAvailableDate(): Promise<Date> {
  await connectToDatabase();
  const latestBattle = await Battle.findOne().sort({ battleEndTime: -1 });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!latestBattle || latestBattle.battleEndTime < today) {
    return today;
  }
  const nextDay = new Date(latestBattle.battleEndTime);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

export async function scheduleBattle(data: any): Promise<any> {
  await connectToDatabase();
  const startDate = await getNextAvailableDate();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);
  const newBattle = new Battle({
    ...data,
    battleStartTime: startDate,
    battleEndTime: endDate,
    isBattleEnded: false,
    isNftMinted: false,
  });
  return newBattle.save();
}

export async function deleteAll(): Promise<void> {
  await connectToDatabase();
  await Battle.deleteMany({});
}

export const findTodaysBattle = async (campaignId:string): Promise<any> => {
  await connectToDatabase();
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  return Battle.findOne({
    campaignId:campaignId,
    startTime: { $lte: endOfDay },
    endTime: { $gte: startOfDay }
  });
};

export const findPreviousBattles = async (page: number, limit: number,campaignId:string): Promise<any> => {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const totalDocuments = await Battle.countDocuments({ endTime: { $lt: today },campaignId:campaignId});
  const totalPages = Math.ceil(totalDocuments / limit);
  const pastBattles = await Battle.find({ endTime: { $lt: today } ,campaignId:campaignId}).sort({ startTime: -1,_id: 1  }).skip(skip).limit(limit);
  return { pastBattles ,totalDocuments,totalPages};
}

export const findPreviousBattlesAsc = async (page: number, limit: number,campaignId:string): Promise<any> => {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const totalDocuments = await Battle.countDocuments({ endTime: { $lt: today },campaignId:campaignId});
  const totalPages = Math.ceil(totalDocuments / limit);
  const pastBattles = await Battle.find({ endTime: { $lt: today },campaignId:campaignId}).sort({ startTime: 1 ,_id: 1 }).skip(skip).limit(limit);
  return { pastBattles,totalDocuments,totalPages };
}

export const findPreviousBattlesByVotes = async (page: number, limit: number,campaignId:string): Promise<any> => {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const totalDocuments = await Battle.countDocuments({ endTime: { $lt: today },campaignId:campaignId});
  const totalPages = Math.ceil(totalDocuments / limit);
  const pastBattles = await Battle.aggregate([
    {
      $match: { endTime: { $lt: today },campaignId:campaignId }
    },
    {
      $addFields: {
        totalVotes: { $add: ["$artAVotes", "$artBVotes"] }
      }
    },
    {
      $sort: { totalVotes: -1, _id: 1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);
  return { pastBattles,totalDocuments,totalPages };
}

export const findPreviousBattlesByVotesAsc = async (page: number, limit: number,campaignId:string): Promise<any> => {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const totalDocuments = await Battle.countDocuments({ endTime: { $lt: today },campaignId:campaignId});
  const totalPages = Math.ceil(totalDocuments / limit);
  const pastBattles = await Battle.aggregate([
    {
      $match: { endTime: { $lt: today } ,campaignId:campaignId}
    },
    {
      $addFields: {
        totalVotes: { $add: ["$artAVotes", "$artBVotes"] }
      }
    },
    {
      $sort: { totalVotes: 1, _id: 1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);
  return { pastBattles,totalDocuments,totalPages };
}

export const findAllBattles = async (): Promise<any> => {
  await connectToDatabase();
  return Battle.find({});
}


export const updateBattle = async(battleId: any): Promise<any> => {
  await connectToDatabase();
  const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const updatedBattle = await Battle.findByIdAndUpdate(
        battleId,
        { endTime: yesterday },
        { new: true }
      );
      console.log("Updated!");
}