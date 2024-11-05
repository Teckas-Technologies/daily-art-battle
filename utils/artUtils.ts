import { connectToDatabase } from "./mongoose";
import ArtTable from "../model/ArtTable";
import UpVoting from "../model/UpVoting";
import uploadArweaveUrl from "./uploadArweaveUrl";
import User from "../model/User";

export async function scheduleArt(data: any): Promise<any> {
  await connectToDatabase();
  const startDate = new Date();
  if(!data.artistId || !data.colouredArt){
    return;
  }
  if(!data.arttitle) {
    data.arttitle = "ART Battle"
  }
  if (!data.colouredArtReference && data.colouredArt) {
    console.log("Entered! ", data.colouredArt)
    if(!data.colouredArt.includes("https://")){
      data.colouredArt = `https://arweave.net/${data.colouredArt}`;
    }
    const res = await uploadArweaveUrl(data.colouredArt);
    data.colouredArtReference = res.referenceUrl;
  }
  console.log("Setted Art! ", data.colouredArt)
  console.log("Setted! ", data.colouredArtReference)
  const newArt = new ArtTable({
    ...data,
    uploadedTime: startDate,
  });
  return newArt.save();
}

export const findAllArts = async (campaignId:string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false ,campaignId:campaignId,isHided:false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false ,campaignId:campaignId,isHided:false })
  .sort({ raffleTickets: -1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByVoteAsc = async (campaignId:string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false ,campaignId:campaignId,isHided:false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false, campaignId:campaignId ,isHided:false})
  .sort({ raffleTickets: 1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByDate = async (campaignId:string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false ,campaignId:campaignId,isHided:false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false, campaignId:campaignId ,isHided:false})
  .sort({ uploadedTime: -1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();

  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByDateAsc = async (campaignId:string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({ isStartedBattle: false ,campaignId:campaignId,isHided:false });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({ isStartedBattle: false, campaignId:campaignId ,isHided:false})
  .sort({ uploadedTime: 1,_id: 1 })
  .skip(skip)
  .limit(limit)
  .exec();
  return {arts,totalDocuments,totalPages};
};

export const findAllArtsByCampaign = async (page: number, limit: number,campaignId:string): Promise<any> => {
  await connectToDatabase();
  const skip = limit * (page === 1 ? 0 : page - 1); 
  const totalDocuments = await ArtTable.countDocuments({campaignId:campaignId });
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find({campaignId:campaignId })
  .sort({_id: 1 })
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


export const findAndupdateArtById = async (id: any,participantId:any,campaignId:string): Promise<any> => {
  await connectToDatabase();
  const vote = await UpVoting.create({ participantId, artId:id,campaignId });
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



export const findcomingArtsByName = async (name:string,campaignId:string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const queryFilter: { isStartedBattle: boolean; isCompleted: boolean; campaignId: string; arttitle?: { $regex: string; $options: string } } = {
    isStartedBattle: false,
    isCompleted: false,
    campaignId: campaignId,
  };
  if (name) {
    queryFilter.arttitle = { $regex: name, $options: 'i' }; 
  }
  const skip = (page - 1) * limit;
  const arts = await ArtTable.find(queryFilter)
    .sort({ uploadedTime: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { arts };
};
export const findcomingArtsByArtist = async (artistNameSubstring:string,campaignId:string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = (page - 1) * limit;
  const artists = await User.find({ 
    $or: [
      { firstName: { $regex: `^${artistNameSubstring}`, $options: 'i' } }, 
      { lastName: { $regex: `^${artistNameSubstring}`, $options: 'i' } }   
    ]
  }).exec(); 

  if (artists.length === 0) {
    return { arts: [], totalDocuments: 0, totalPages: 0 }; 
  }
  const artistEmails = artists.map(artist => artist.email);
  const arts = await ArtTable.find({ 
      isStartedBattle: false, 
      isCompleted: false, 
      campaignId: campaignId,
      email: { $in: artistEmails } 
    })
    .sort({ uploadedTime: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { arts};
};


export const findCompletedArtsByName = async ( name: string, campaignId: string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const queryFilter: { isStartedBattle: boolean; isCompleted: boolean; campaignId: string; arttitle?: { $regex: string; $options: string } } = {
    isStartedBattle: true,
    isCompleted: true,
    campaignId: campaignId,
  };
  const skip = (page - 1) * limit;
  if (name) {
    queryFilter.arttitle = { $regex: name, $options: 'i' }; 
  }

  const arts = await ArtTable.find(queryFilter)
    .sort({ uploadedTime: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { arts };
};




export const findCompletedArtsByArtist = async ( artistNameSubstring: string, campaignId: string,page: number, limit: number): Promise<any> => {
  await connectToDatabase();
  const skip = (page - 1) * limit;
  const artists = await User.find({ 
    $or: [
      { firstName: { $regex: `^${artistNameSubstring}`, $options: 'i' } }, 
      { lastName: { $regex: `^${artistNameSubstring}`, $options: 'i' } }   
    ]
  }).exec(); 
  if (artists.length === 0) {
    return { arts: [], totalDocuments: 0, totalPages: 0 }; 
  }
  const artistEmails = artists.map(artist => artist.email);
  const arts = await ArtTable.find({ 
      isStartedBattle: true, 
      isCompleted: true, 
      campaignId: campaignId,
      email: { $in: artistEmails } 
    })
    .sort({ uploadedTime: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { arts};
};
