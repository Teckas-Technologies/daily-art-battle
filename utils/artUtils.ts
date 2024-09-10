import { connectToDatabase } from "./mongoose";
import ArtTable from "../model/ArtTable";
import UpVoting from "../model/UpVoting";
export async function scheduleArt(data: any): Promise<any> {
  await connectToDatabase();
  const startDate = new Date();
  const newArt = new ArtTable({
    ...data,
    uploadedTime: startDate,
  });
  return newArt.save();
}

export const findAllArts = async (page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false })
  .sort({ upVotes: -1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByVoteAsc = async (page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false })
  .sort({ upVotes: 1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByDate = async (page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false })
  .sort({ uploadedTime: -1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByDateAsc = async (page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false })
  .sort({ uploadedTime: 1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findPreviousArts = async (page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const totalDocuments = await ArtTable.countDocuments({ endTime: { $lt: today } }).sort({ endTime: -1 });
  const totalPages = Math.ceil(totalDocuments / limit);
  const pastBattles = await ArtTable.find({ endTime: { $lt: today } })
  .sort({ endTime: -1 })
  .skip(skip)
  .limit(limit);
  return { pastBattles,totalDocuments,totalPages };
}

export const findPreviousArtsByVotes = async (page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const skip = (page - 1) * limit;
  const totalDocuments = await ArtTable.countDocuments({ endTime: { $lt: today } }).sort({ votes: -1 });
  const totalPages = Math.ceil(totalDocuments / limit);
  const pastBattles = await ArtTable.find({ endTime: { $lt: today } })
  .sort({ votes: -1 })
  .skip(skip)
  .limit(limit);
  return { pastBattles,totalDocuments,totalPages };
} 

export const updateArtById = async (id: any): Promise<any> => {
  await connectToDatabase();
   return await ArtTable.findByIdAndUpdate(
    id,
    { $inc: { upVotes: 1 } },
    { new: true }
  );

};


export const findAndupdateArtById = async (id: any,participantId:any): Promise<any> => {
  await connectToDatabase();
  const vote = await UpVoting.create({ participantId, artId:id,votesCount:1 });
   await ArtTable.findByIdAndUpdate(
    id,
    { $inc: { upVotes: 1 } },
    { new: true }
  );
  return vote;
};

export const findBattles = async (): Promise<any> => {
  await connectToDatabase();
  return await ArtTable.find().sort({ upVotes: -1 }).limit(2).exec();
};

export const findArtById = async (id:any): Promise<any> => {
  await connectToDatabase();
  return await ArtTable.findOne({_id:id});
};

