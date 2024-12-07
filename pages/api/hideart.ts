import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import ArtTable from "../../model/ArtTable";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try {
        await connectToDatabase();
        if(req.method=="GET"){
            const id = req.query.id;
            const updatedArt = await ArtTable.findByIdAndUpdate(
                id,
                { $set: { isStartedBattle: true ,isCompleted:true} },
                { new: true }
              );
              if (updatedArt) {
                res.status(200).json({ message: "Art updated successfully", updatedArt });
              } else {
                res.status(404).json({ message: "Art not found" });
              }
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
}