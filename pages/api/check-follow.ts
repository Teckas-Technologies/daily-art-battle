import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken, userId } = req.query;  // pass these values in the query

  if (!accessToken || !userId) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const yourAccountId = 'sathishmur79799'; // your X account's user ID

    // Check if the user follows your account
    const followResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}/following`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const follows = followResponse.data.data.some(
      (follow: any) => follow.id === yourAccountId
    );

    if (follows) {
      return res.status(200).json({ message: 'User follows your account' });
    } else {
      return res.status(200).json({ message: 'User does not follow your account' });
    }
  } catch (error:any) {
    console.error('Error checking follow status:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
}
