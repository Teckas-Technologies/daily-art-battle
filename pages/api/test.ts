import { getSession, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// Function to fetch Management API Access Token
export const getManagementApiToken = async (): Promise<string> => {
  const response = await fetch(`${process.env.AUTH0_API_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `${process.env.AUTH0_API_URL}/api/v2/`,
      grant_type: 'client_credentials',
      scope: 'read:users',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch Management API token: ${errorData.error_description}`);
  }

  const data: { access_token: string } = await response.json();
  return data.access_token;
};
// Function to fetch user details from the Management API
export const getUserDetails = async (userId: string, accessToken: string): Promise<any> => {
  const response = await fetch(`${process.env.AUTH0_API_URL}/api/v2/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch user details: ${errorData.message}`);
  }

  return response.json();
};

// API Route Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const session = await getSession(req, res);
    console.log(session);

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = await getManagementApiToken();
    const userDetails = await getUserDetails(session.user.sub, accessToken);

    return res.status(200).json(userDetails);
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
