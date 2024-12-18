// pages/api/generateImage.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { OPENAI } from "@/config/constants";
import User from "../../model/User";
import { authenticateUser, verifyToken } from "../../utils/verifyToken";
import JwtPayload from "../../utils/verifyToken";
import { AI_IMAGE } from "@/config/points";
import Transactions from "../../model/Transactions";
import { TransactionType } from "../../model/enum/TransactionType";
import { getSession } from "@auth0/nextjs-auth0";

const openai = new OpenAI({
  apiKey: OPENAI,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const email = session.user.email;
    //This api to generate ai arts
  if (req.method == "POST") {
    const { prompt } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email not found in the token." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User profile not found." });
    }
    if (user.gfxCoin < AI_IMAGE) {
      return res
        .status(400)
        .json({ success: false, error: "Insufficient balance to generate." });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = response.data[0].url;
      if (imageUrl) {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error("Failed to download image");
        }

        const buffer = await response.arrayBuffer(); // Get image data as buffer

        // Send image as Blob in response
        const blob = Buffer.from(buffer).toString("base64"); // Convert buffer to base64-encoded string
        await User.updateOne({ email }, { $inc: { gfxCoin: -AI_IMAGE } });
        const newTransaction = new Transactions({
          email: email,
          gfxCoin: AI_IMAGE,  
          transactionType: TransactionType.SPENT_FOR_AI_IMAGE_GENERATION  
        });
        
        await newTransaction.save();
        res.status(200).json({ imageUrl, imageBlob: blob });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  }
}
catch(error:any){
  return res.status(400).json({error:error.message});
}
}
