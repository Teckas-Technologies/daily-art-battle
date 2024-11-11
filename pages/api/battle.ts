//battle.ts is used for creating battle,updating battle ,fetching battle and deleting battle.
import type { NextApiRequest, NextApiResponse } from "next";
import {
  scheduleBattle,
  deleteAll,
  findTodaysBattle,
  findPreviousBattles,
  findAllBattles,
  updateBattle,
  findPreviousBattlesByVotesAsc,
  findPreviousBattlesByVotes,
  findPreviousBattlesAsc,
} from "../../utils/battleUtils";
import { authenticateUser, verifyToken } from "../../utils/verifyToken";
import Battle from "../../model/Battle";
import { connectToDatabase } from "../../utils/mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
   
    await connectToDatabase();
    switch (req.method) {
      //POST method is used for creating battle
      case "POST":
        const email = await authenticateUser(req);
        const battle = req.body;
        const scheduledBattle = await scheduleBattle(battle);
        return res.status(201).json(scheduledBattle);
      //GET method is used for fetching battles
      case "GET":
        const timeout = (ms: any) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        const { queryType } = req.query;
        //Here we'll fetch today battles
        if (queryType === "Today") {
          const campaignId = req.query.campaignId as string;
          await timeout(1000);
          const todayBattle = await findTodaysBattle(campaignId);
          return res.status(200).json(todayBattle);
          //Here we'll fetch battles with pagination
        } else if (queryType=="byid"){
          const id = req.query.id as string;
          const battle = await Battle.findOne({_id:id});
          return res.status(200).json(battle);
        }
        else if (queryType === "battles") {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 6;
          const sort = req.query.sort;
          const campaignId = req.query.campaignId as string;
          if (sort == "voteDsc") {
            const battles = await findPreviousBattlesByVotes(
              page,
              limit,
              campaignId
            );
            return res.status(200).json(battles);
          } else if (sort == "voteAsc") {
            const battles = await findPreviousBattlesByVotesAsc(
              page,
              limit,
              campaignId
            );
            return res.status(200).json(battles);
          } else if (sort == "dateAsc") {
            const battles = await findPreviousBattlesAsc(
              page,
              limit,
              campaignId
            );
            return res.status(200).json(battles);
          } else if (sort == "dateDsc") { 
            const battles = await findPreviousBattles(page, limit, campaignId);
            return res.status(200).json(battles);
          }
           else {
            const battles = await findPreviousBattles(page, limit, campaignId);
            return res.status(200).json(battles);
          }
        } else {
          const battles = await findAllBattles();
          return res.status(200).json(battles);
        }
      //PUT method is used to update battle by id
      case "PUT":
        await authenticateUser(req);
        const { battleId, campaignId } = req.query;
        if (!battleId) {
          return res.status(400).json({ error: "Battle ID is required" });
        }
        await updateBattle(battleId);
        return res.status(200).json({ message: "Battle Updated" });
      //DELETE method is used to delete battle by id
      case "DELETE":
        await deleteAll();
        return res.status(200).json({ message: "All battles deleted" });

      default:
        res.setHeader("Allow", ["POST", "GET", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}
