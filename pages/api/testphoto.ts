//mintNfts.ts is used to create battles and countVote and Update battles
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    
        const { imageData, logoData } = req.body;

        if (!imageData || !logoData) {
          return res.status(400).json({ message: 'Image and logo data are required' });
        }
      
        try {
          const inputBuffer = Buffer.from(imageData, 'base64');
          const logoBuffer = Buffer.from(logoData, 'base64');
      
          const processedImageBuffer = await sharp(inputBuffer)
            .resize(1024, 1024)
            .composite([{ input: logoBuffer, gravity: 'northwest' }])
            .toBuffer();
      
          const outputPath = path.join(process.cwd(), 'public', 'output.jpg');
          await fs.writeFile(outputPath, processedImageBuffer);
      
          return res.status(200).json({ message: 'Image processed successfully', url: '/output.jpg' });
        } catch (error) {
          console.error('Error processing image:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
}
}
