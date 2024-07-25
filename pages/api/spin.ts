import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile, uploadReference,uploadBuffer } from "@mintbase-js/storage";
import { MIMEType } from 'util';
import spinner from '../../utils/spinnerUtils';
// Configure the API handler
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageData} = req.body;
    const ress = await spinner();
  
    if (!imageData ) {
      return res.status(400).json({ message: 'Image, logo, and losing data are required' });
    }

    try {
      const inputBuffer = Buffer.from(ress, 'base64');

      const blob = new Blob([inputBuffer], { type: "image/jpeg" });
  
      const processedFile = new File([blob], "processed-image.jpg", {
        type: "image/jpeg",
      });

     
      const uploadResult = await uploadBuffer(inputBuffer,"image/gif","File");
      const url = `https://arweave.net/${uploadResult.id}`;
      const metadata = {
        title: "Art Battle",
        media: url,
      };
      // const referenceResult = await uploadReference(metadata);
      // const referenceUrl = `https://arweave.net/${referenceResult.id}`;

      console.log(url);
      
    
      return res.status(200).send(true);    
     
    } catch (error) {
      console.error('Error processing image:', JSON.stringify(error));
      console.error('Error processing image:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
