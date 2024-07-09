import { NextApiRequest, NextApiResponse } from 'next';
import Jimp from 'jimp';
import runProcess from '../../utils/generateImage';

// Configure the API handler
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase the size limit as needed
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageData, logoData, losingData } = req.body;
  
    if (!imageData || !logoData || !losingData) {
      return res.status(400).json({ message: 'Image, logo, and losing data are required' });
    }

    try {
      const inputBuffer = Buffer.from(imageData, 'base64');
      const logoBuffer = Buffer.from(logoData, 'base64');
      const losingDataBuffer = Buffer.from(losingData, 'base64');

      // Load the main image, logo, and losing data
      const [originalImage, logoImage, losingArtImage] = await Promise.all([
        Jimp.read(inputBuffer),
        Jimp.read(logoBuffer),
        Jimp.read(losingDataBuffer)
      ]);

      // Resize the logo to match the original image size
      logoImage.resize(originalImage.bitmap.width, originalImage.bitmap.height);

      // Resize the losing data image to be 256px wide
      const losingArtWidth = 256;
      losingArtImage.resize(losingArtWidth, Jimp.AUTO);

      // Composite the logo onto the original image
      originalImage.composite(logoImage, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1, // Keep the opacity of logoImage as it is
        opacityDest: 1 // Keep the opacity of originalImage as it is
      });

      // Composite the losing data image onto the original image at the bottom right corner
      const padding = 10;
      const x = originalImage.bitmap.width - losingArtImage.bitmap.width - padding;
      const y = originalImage.bitmap.height - losingArtImage.bitmap.height - padding;
      originalImage.composite(losingArtImage, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1, // Keep the opacity of losingArtImage as it is
        opacityDest: 1 // Keep the opacity of originalImage as it is
      });

      // Get the processed image as a buffer
      const processedImageBuffer = await originalImage.getBufferAsync(Jimp.MIME_JPEG);

    //   // Set response headers for a downloadable file
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
