import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import ArtTable from "../../model/ArtTable";
import { authenticateUser } from "../../utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = await authenticateUser(req);
    if (req.method == "GET") {
      try {
        await connectToDatabase();
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
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
