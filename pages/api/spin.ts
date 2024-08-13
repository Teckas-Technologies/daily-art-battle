import { NextApiRequest, NextApiResponse } from 'next';
import spinner from '../../utils/spinnerUtils';
import uploadArweave from '../../utils/uploadArweave';
// Configure the API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const ress = await spinner();
    const response = await uploadArweave(ress);
    console.log(response);
    return res.status(200).send(true);    
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
