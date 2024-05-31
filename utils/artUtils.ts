import { connectToDatabase } from "./mongoose";
import ArtTable from "../model/ArtTable";

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
  const skip = (page - 1) * limit;
  return ArtTable.find({ isCompleted: false })
    .sort({ upVotes: -1 })
    .skip(skip)
    .limit(limit);
};
export const updateArtById = async (id: any): Promise<any> => {
  await connectToDatabase();
  return ArtTable.findByIdAndUpdate(
    id,
    { $inc: { upVotes: 1 } },
    { new: true }
  );
};

export const findBattles = async (): Promise<any> => {
  await connectToDatabase();
  return await ArtTable.find().sort({ upVotes: -1 }).limit(2).exec();
};
