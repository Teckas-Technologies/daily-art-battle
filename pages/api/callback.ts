import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
console.log("called");
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const clientId = process.env.TWITTER_CLIENT_ID!;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET!;
    const redirectUri = process.env.TWITTER_REDIRECT_URI!;

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code: code as string,
        code_verifier: 'challenge', // same challenge used earlier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user's profile using the access token
    const profileResponse = await axios.get(
      'https://api.twitter.com/2/users/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userProfile = profileResponse.data;
    console.log(userProfile);
    const userId = userProfile.data.id;  // Authenticated user's ID

    const yourAccountId = '1833828927992918016'; // Replace with your Twitter account's user ID

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

  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to authenticate with Twitter or check follow status' });
  }
}