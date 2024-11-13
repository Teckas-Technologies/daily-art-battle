import { connectToDatabase } from "./mongoose";
import ArtTable from "../model/ArtTable";
import UpVoting from "../model/UpVoting";
import uploadArweaveUrl from "./uploadArweaveUrl";
import User from "../model/User";
import Battle from "../model/Battle";

export async function scheduleArt(data: any): Promise<any> {
  await connectToDatabase();
  const startDate = new Date();
  if(!data.colouredArt){
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



export const findComingArts = async (
  searchTerm: string,
  campaignId: string,
  page: number,
  limit: number
): Promise<any> => {
  await connectToDatabase();
  const skip = (page - 1) * limit;

  // Base query filter for ArtTable
  const queryFilter: {
    isStartedBattle: boolean;
    isCompleted: boolean;
    campaignId: string;
    arttitle?: { $regex: string; $options: string };
    email?: { $in: string[] };
  } = {
    isStartedBattle: false,
    isCompleted: false,
    campaignId: campaignId,
  };

  // Search for artists that match the search term in firstName or lastName
  const artists = await User.find({
    $or: [
      { firstName: { $regex: `^${searchTerm}`, $options: 'i' } },
      { lastName: { $regex: `^${searchTerm}`, $options: 'i' } }
    ]
  }).exec();

  if (artists.length > 0) {
    // Include artist emails in the filter if any artist matches
    const artistEmails = artists.map(artist => artist.email);
    queryFilter.email = { $in: artistEmails };
  } else if (searchTerm) {
    // Only apply the art title filter if no artist matches
    queryFilter.arttitle = { $regex: searchTerm, $options: 'i' };
  }

  // Fetch arts based on the constructed query filter
  const totalDocuments = await ArtTable.countDocuments(queryFilter);
  const totalPages = Math.ceil(totalDocuments / limit);
  const arts = await ArtTable.find(queryFilter)
    .sort({ uploadedTime: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return { arts,totalDocuments,totalPages };
};


export const findCompletedArts = async (
  searchTerm: string,
  campaignId: string,
  page: number,
  limit: number
): Promise<any> => {
  await connectToDatabase();
  const skip = (page - 1) * limit;

  // Base query filter for the Battle table
  const queryFilter: {
    isBattleEnded: boolean;
    campaignId: string;
    $or?: Array<{ [key: string]: { $regex: string; $options: string } } | { [key: string]: { $in: string[] } }>;
  } = {
    isBattleEnded: true,
    campaignId: campaignId,
  };

  // Search for artists that match the search term in firstName or lastName
  const artists = await User.find({
    $or: [
      { firstName: { $regex: `^${searchTerm}`, $options: 'i' } },
      { lastName: { $regex: `^${searchTerm}`, $options: 'i' } }
    ]
  }).exec();

  if (artists.length > 0) {
    // Include artist emails in the filter if any artist matches
    const artistEmails = artists.map(artist => artist.email);
    queryFilter.$or = [
      { artAartistEmail: { $in: artistEmails } },
      { artBartistEmail: { $in: artistEmails } }
    ];
  } else if (searchTerm) {
    // Apply art title search if no artist matches
    queryFilter.$or = [
      { artAtitle: { $regex: searchTerm, $options: 'i' } },
      { artBtitle: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  // Fetch completed arts from the Battle table based on the constructed query filter
  const totalDocuments = await Battle.countDocuments(queryFilter);
  const totalPages = Math.ceil(totalDocuments / limit);
  const completedBattles = await Battle.find(queryFilter)
    .sort({ endTime: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
    

  return { completedBattles,totalPages,totalDocuments };
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
