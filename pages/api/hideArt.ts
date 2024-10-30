import { NextApiRequest, NextApiResponse} from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import ArtTable from '../../model/ArtTable';
import { authenticateUser } from '../../utils/verifyToken';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    await connectToDatabase();
    const email = await authenticateUser(req);
    try {
      const {artId} = req.body;  
      if (!artId) {
        return res.status(400).json({ message: "artId is required" });
    }
    const art = await ArtTable.findOne(
        { _id: artId },
    );

    if (!art) {
        return res.status(404).json({ message: "Art not found" });
    }

    art.isHided = true;
    await art.save();
      res.status(200).json({message:"successfully hided art" });
    } catch (error:any) {
      res.status(500).json({ success: false, error:error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
