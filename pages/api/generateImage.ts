// pages/api/generateImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    // return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
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
    if(imageUrl){
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }
  
      const buffer = await response.arrayBuffer(); // Get image data as buffer
  
      // Send image as Blob in response
      const blob = Buffer.from(buffer).toString('base64'); // Convert buffer to base64-encoded string
      res.status(200).json({ imageUrl,imageBlob: blob });
    }
  //res.send(imageUrl)
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}