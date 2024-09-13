import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.TWITTER_CLIENT_ID!;
  const redirectUri = process.env.TWITTER_REDIRECT_URI!;

  // X OAuth 2.0 URL for authorization
  const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&client_id=aXl6dklTQkpobGdBaEhzaVZ3OHY6MTpjaQ&redirect_uri=https://d56e-2409-408d-3d85-6a88-1873-e0db-cacc-b369.ngrok-free.app/api/callback&code_challenge_method=plain`;
  // Redirect the user to X's OAuth page
  res.redirect(twitterAuthUrl);
}
