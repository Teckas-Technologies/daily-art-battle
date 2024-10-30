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
  findCompletedArtsByArtist,
  findCompletedArtsByName,
  findcomingArtsByName,
  findcomingArtsByArtist
} from "../../utils/artUtils";
import { authenticateUser, verifyToken } from "../../utils/verifyToken";
import User from "../../model/User";
import Transactions from "../../model/Transactions";
import { ART_UPLOAD } from "@/config/points";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
   const email = await authenticateUser(req);
    switch (req.method) {
      //POST method is used to create art.
      case "POST":
        const art = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User profile not found." });
        }
        if(user.nearAddress!=art.artistId){
          return res
          .status(404)
          .json({ success: false, error: "User wallet address not matched" });
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
          transactionType: "spent"  
        });
        
        await newTransaction.save();
        return res.status(201).json(saveart);

      //GET method is used to fetch arts with pagination.
      case "GET":
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

        if(queryType=="coming"){
          const search = req.query.search
          if(search=="artsName"){
          const campaignId = req.query.campaignId as string;
           const name = req.query.name as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const battles = await findcomingArtsByName(page, limit,name,campaignId);
          return res.status(200).json(battles);
          }
          else if(search=="artistName"){
            const campaignId = req.query.campaignId as string;
            const name = req.query.name as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
            const battles = await findcomingArtsByArtist(page, limit,name,campaignId);
            return res.status(200).json(battles);
          }
       
        }
        if(queryType=="completed"){
          const search = req.query.search
          if(search=="artsName"){
            const campaignId = req.query.campaignId as string;
           const name = req.query.name as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const battles = await findCompletedArtsByName(page, limit,name,campaignId);
          return res.status(200).json(battles);
          }
          else if(search=="artistName"){
            const campaignId = req.query.campaignId as string;
            const name = req.query.name as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
            const battles = await findCompletedArtsByArtist(page, limit,name,campaignId);
            return res.status(200).json(battles);
          }
       
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
        } else {
          const sort = req.query.sort;
          const campaignId = req.query.campaignId as string;
          if (sort == "voteDsc") {
            const { arts } = await findAllArts(
              campaignId
            );
            return res.status(200).json({ arts });
          } else if (sort == "dateDsc") {
            const { arts} =
              await findAllArtsByDate(campaignId);
            return res.status(200).json({ arts});
          } else if (sort == "voteAsc") {
            const { arts } =
              await findAllArtsByVoteAsc(campaignId);
            return res.status(200).json({ arts});
          } else if (sort == "dateAsc") {
            const { arts} =
              await findAllArtsByDateAsc(campaignId);
            return res.status(200).json({ arts });
          } else {
            const { arts, totalDocuments, totalPages } =
              await findAllArtsByDate( campaignId);
            return res.status(200).json({ arts, totalDocuments, totalPages });
          }
        }

      //PUT method is used to update art by id.
      case "PUT":
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
