import { connect } from "http2";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { getSession } from "@auth0/nextjs-auth0";
import User from "../../model/User";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
          const session = await getSession(req, res);
            if (!session || !session.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
          const nearAddress = req.query.nearAddress;
          const existingUser = await User.find({nearAddress:nearAddress});
          const exists = existingUser.length > 0;
          return res.status(200).json({ isExist:exists });
    } catch (error:any) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}