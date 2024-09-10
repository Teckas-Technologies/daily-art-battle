// pages/api/generateImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { OPENAI } from '@/config/constants';
import User from '../../model/User';

const openai = new OpenAI({
  apiKey: OPENAI,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == 'POST') {
    const { prompt, participantId } = req.body;
    const user = await User.findOne({ walletAddress: participantId });
    if (user) {
      if (user.gfxCoin >= 1) {
        if (!prompt) {
          return res.status(400).json({ error: 'Prompt is required' });
        }
        try {
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          });
          const imageUrl = response.data[0].url;
          if (imageUrl) {
            const response = await fetch(imageUrl);
            if (!response.ok) {
              throw new Error('Failed to download image');
            }
            const buffer = await response.arrayBuffer(); // Get image data as buffer

            // Send image as Blob in response
            const blob = Buffer.from(buffer).toString('base64'); // Convert buffer to base64-encoded string
            await User.updateOne(
              { walletAddress: participantId },
              {
                $inc: {
                  gfxCoin: -1,
                }
              },
            );
            res.status(200).json({ imageUrl, imageBlob: blob });
          }
        } catch (error) {
          console.error('Error generating image:', error);
          res.status(500).json({ error: 'Failed to generate image' });
        }
      } else {
        return res.status(400).json({
          success: false,
          error: "Insufficient balance to vote.",
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, error: "User profile not found." });
    }
  }
}