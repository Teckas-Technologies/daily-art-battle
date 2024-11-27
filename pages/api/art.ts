//art.ts is used for creating creating arts ,fetching arts and updating art by id.
import type { NextApiRequest, NextApiResponse } from "next";
import {
  scheduleArt,
  findAllArts,
  updateArtById,
  findBattles,
  findPreviousArts,
  findPreviousArtsByVotes,
  findArtById,
  findAllArtsByDate,
  findAllArtsByVoteAsc,
  findAllArtsByDateAsc,
  findAllArtsByCampaign,
  findCompletedArts,
  findComingArts,
} from "../../utils/artUtils";
import { authenticateUser, verifyToken } from "../../utils/verifyToken";
import User from "../../model/User";
import Transactions from "../../model/Transactions";
import { ART_UPLOAD } from "@/config/points";
import { validateUser } from "../../utils/validateClient";
import { TransactionType } from "../../model/enum/TransactionType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
  
    switch (req.method) {
      //POST method is used to create art.
      case "POST":
        const email = await authenticateUser(req);
        const art = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User profile not found." });
        }
        if (user.gfxCoin < ART_UPLOAD) {
          return res
            .status(400)
            .json({ success: false, error: "Insufficient balance to upload." });
        }
        console.log("Art >> ", art);
        art.email = email;
        const saveart = await scheduleArt(art);
        await User.updateOne(
          { email: email },
          { $inc: { gfxCoin: -ART_UPLOAD } }
        );
        const newTransaction = new Transactions({
          email: email,
          gfxCoin: ART_UPLOAD,  
          transactionType: TransactionType.SPENT_FOR_ART_UPLOAD  
        });
        
        await newTransaction.save();
        return res.status(201).json(saveart);

      //GET method is used to fetch arts with pagination.
      case "GET":
        await validateUser(req);
        const { queryType } = req.query;
        if (queryType == "upcoming") {
          const id = req.query.id;
          const art = await findArtById(id);
          return res.status(200).json({ art });
        }
        if(queryType=="campaign"){
          const id = req.query.id as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const battles = await findAllArtsByCampaign(page, limit,id);
          return res.status(200).json(battles);
        }
         //Search upcoming arts based on art name and artist name
        if(queryType=="coming"){
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const campaignId = req.query.campaignId as string;
           const name = req.query.name as string;
          const battles = await findComingArts(name,campaignId,page,limit);
          return res.status(200).json(battles);
        }
         //Fetch completed battles based on art name and artist name
        if(queryType=="completed"){
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
            const campaignId = req.query.campaignId as string;
           const name = req.query.name as string;
          const battles = await findCompletedArts(name,campaignId,page,limit);
          return res.status(200).json(battles);
        }

        if (queryType === "battles") {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const sort = req.query.sort;
          if (sort == "vote") {
            const battles = await findPreviousArtsByVotes(page, limit);
            return res.status(200).json(battles);
          } else if (sort == "date") {
            const { pastBattles, totalDocuments, totalPages } =
              await findPreviousArts(page, limit);
            return res
              .status(200)
              .json({ pastBattles, totalDocuments, totalPages });
          } else {
            const { battles, totalDocuments, totalPages } =
              await findPreviousArts(page, limit);
            return res
              .status(200)
              .json({ battles, totalDocuments, totalPages });
          }
        } 
        //Fetch upcoming arts with sorting
        else {
          await validateUser(req);
          const sort = req.query.sort;
          const campaignId = req.query.campaignId as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          if (sort == "voteDsc") {
            const { arts, totalDocuments, totalPages } = await findAllArts(
              campaignId,
              page, limit
            );
            return res.status(200).json({ arts , totalDocuments, totalPages});
          } else if (sort == "dateDsc") {
            const { arts, totalDocuments, totalPages} =
              await findAllArtsByDate(campaignId,page, limit);
            return res.status(200).json({ arts, totalDocuments, totalPages});
          } else if (sort == "voteAsc") {
            const { arts, totalDocuments, totalPages } =
              await findAllArtsByVoteAsc(campaignId,page, limit);
            return res.status(200).json({ arts, totalDocuments, totalPages});
          } else if (sort == "dateAsc") {
            const { arts, totalDocuments, totalPages} =
              await findAllArtsByDateAsc(campaignId,page, limit);
            return res.status(200).json({ arts , totalDocuments, totalPages});
          } else {
            const { arts, totalDocuments, totalPages } =
              await findAllArtsByDate( campaignId,page, limit);
            return res.status(200).json({ arts, totalDocuments, totalPages });
          }
        }

      //PUT method is used to update art by id.
      case "PUT":
        await authenticateUser(req);
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: "ID is required for updating" });
        }
        const idString = typeof id === "string" ? id : String(id);
        if (typeof idString === "string") {
          const result = await updateArtById(idString);
          if (result) {
            return res.status(200).json(result);
          } else {
            return res.status(404).json({ error: "Art not found" });
          }
        } else {
          return res.status(400).json({ error: "ID is required for updating" });
        }

      default:
        res.setHeader("Allow", ["POST", "GET", "DELETE", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error:any) {
    console.error("API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
