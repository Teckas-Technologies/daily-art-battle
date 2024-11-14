import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import ArtTable from "../../model/ArtTable";
import { authenticateUser } from "../../utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();
    const email = await authenticateUser(req);
    // TO fetch users uploaded arts
    if (req.method == "GET") {
      try {
        const queryType = req.query.queryType;
        if(queryType=='uploadedArts'){
          const queryFilter = req.query.sort;
          if(queryFilter=='voteAsc'){
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const skip = limit * (page === 1 ? 0 : page - 1);
          const totalDocuments = await ArtTable.countDocuments({ email: email });
          const totalPages = Math.ceil(totalDocuments / limit);
          const arts = await ArtTable.find({ email: email })
            .sort({ raffleTickets: 1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
          return res.status(200).json({ totalDocuments, totalPages, arts });
          }
          else if(queryFilter=='voteDsc'){
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
            const skip = limit * (page === 1 ? 0 : page - 1);
            const totalDocuments = await ArtTable.countDocuments({ email: email });
            const totalPages = Math.ceil(totalDocuments / limit);
            const arts = await ArtTable.find({ email: email })
              .sort({ raffleTickets: -1, _id: 1 })
              .skip(skip)
              .limit(limit)
              .exec();
            return res.status(200).json({ totalDocuments, totalPages, arts });
            }
            else if(queryFilter=='dateAsc'){
              const page = parseInt(req.query.page as string) || 1;
              const limit = parseInt(req.query.limit as string) || 9;
              const skip = limit * (page === 1 ? 0 : page - 1);
              const totalDocuments = await ArtTable.countDocuments({ email: email });
              const totalPages = Math.ceil(totalDocuments / limit);
              const arts = await ArtTable.find({ email: email })
                .sort({ uploadedTime: 1, _id: 1 })
                .skip(skip)
                .limit(limit)
                .exec();
              return res.status(200).json({ totalDocuments, totalPages, arts });
              }
              else if(queryFilter=='dateDsc'){
                const page = parseInt(req.query.page as string) || 1;
                const limit = parseInt(req.query.limit as string) || 9;
                const skip = limit * (page === 1 ? 0 : page - 1);
                const totalDocuments = await ArtTable.countDocuments({ email: email });
                const totalPages = Math.ceil(totalDocuments / limit);
                const arts = await ArtTable.find({ email: email })
                  .sort({ uploadedTime: -1, _id: 1 })
                  .skip(skip)
                  .limit(limit)
                  .exec();
                return res.status(200).json({ totalDocuments, totalPages, arts });
                }
        }else if(queryType=="search"){
          const queryFilter = req.query.queryFilter;
          if(queryFilter=="artName"){
          const name = req.query.name as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const queryFilter: {email:string; arttitle?: { $regex: string; $options: string } } = {
            email:email
          };
          if (name) {
            queryFilter.arttitle = { $regex: name, $options: 'i' }; 
          }
          const skip = limit * (page === 1 ? 0 : page - 1);
          const totalDocuments = await ArtTable.countDocuments(queryFilter);
          const totalPages = Math.ceil(totalDocuments / limit);
          const arts = await ArtTable.find(queryFilter)
            .sort({ uploadedTime: -1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        
            return res.status(200).json({arts, totalDocuments, totalPages });
        }
        }
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
