import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageData, logoData } = req.body;

    if (!imageData || !logoData) {
      return res.status(400).json({ message: 'Image and logo data are required' });
    }

    try {
      const inputBuffer = Buffer.from(imageData, 'base64');
      const logoBuffer = Buffer.from(logoData, 'base64');

      const originalImage = sharp(inputBuffer);
      const { width, height } = await originalImage.metadata();

      const resizedLogoBuffer = await sharp(logoBuffer)
        .resize(width, height)
        .toBuffer();

      const processedImageBuffer = await originalImage
        .composite([{ input: resizedLogoBuffer, gravity: 'center' }])
        .toBuffer();

      // Set response headers for a downloadable file
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="processed_image.jpg"');

      // Send the processed image buffer as the response
      return res.status(200).send(processedImageBuffer);
    } catch (error) {
      console.error('Error processing image:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
