import { NextApiRequest, NextApiResponse } from 'next';
import Jimp from 'jimp';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase the size limit as needed
    },
  },
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageData, logoData } = req.body;

    if (!imageData || !logoData) {
      return res.status(400).json({ message: 'Image and logo data are required' });
    }

    try {
      const inputBuffer = Buffer.from(imageData, 'base64');
      const logoBuffer = Buffer.from(logoData, 'base64');

      // Load the main image and logo
      const [originalImage, logoImage] = await Promise.all([
        Jimp.read(inputBuffer),
        Jimp.read(logoBuffer)
      ]);

      // Resize the logo to match the original image size
      logoImage.resize(originalImage.bitmap.width, originalImage.bitmap.height);

      // Composite the logo onto the original image
      originalImage.composite(logoImage, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5, // Adjust opacity as needed
        opacityDest: 1 // Set the destination opacity as needed
      });

      // Get the processed image as a buffer
      const processedImageBuffer = await originalImage.getBufferAsync(Jimp.MIME_JPEG);

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
