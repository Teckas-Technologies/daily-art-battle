import { NextApiRequest, NextApiResponse } from 'next';
import Jimp from 'jimp';
import runProcess from '../../utils/generateImage';
import { uploadFile, uploadReference } from "@mintbase-js/storage";
import { BASE_URL } from "@/config/constants";
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
    const { imageData} = req.body;
  
    if (!imageData ) {
      return res.status(400).json({ message: 'Image, logo, and losing data are required' });
    }

    try {
      const inputBuffer = Buffer.from(imageData, 'base64');
    

      // Load the main image, logo, and losing data
      const [originalImage] = await Promise.all([
        Jimp.read(inputBuffer),
      
      ]);

      // Resize the logo to match the original image size
    

      // Composite the losing data image onto the original image at the bottom right corner
     

      // Get the processed image as a buffer
      const processedImageBuffer = await originalImage.getBufferAsync(Jimp.MIME_JPEG);

      const blob = new Blob([processedImageBuffer], { type: "image/jpeg" });
  
      const processedFile = new File([blob], "processed-image.jpg", {
        type: "image/jpeg",
      });

     
      const uploadResult = await uploadFile(processedFile);
      const url = `https://arweave.net/${uploadResult.id}`;

      const metadata = {
        title: "Art Battle",
        media: processedFile,
      };

      const referenceResult = await uploadReference(metadata);
      const referenceUrl = `https://arweave.net/${referenceResult.id}`;

      console.log(url, referenceUrl);
     

       res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="processed_image.jpg"');

      // Send the processed image buffer as the response
      return res.status(200).send(processedImageBuffer);

    //   // Set response headers for a downloadable file
     
    } catch (error) {
      console.error('Error processing image:', JSON.stringify(error));
      console.error('Error processing image:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
