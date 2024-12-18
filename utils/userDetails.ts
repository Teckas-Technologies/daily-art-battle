import { getSession, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// Function to fetch Management API Access Token
export const getManagementApiToken = async (): Promise<string> => {
  const response = await fetch('https://dev-zypdnx4uu6aa115f.us.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: 'mPoaBU7KUNCUViJ0TXdszcFxbipwEZhp',
      client_secret: 'eFf3cu76Zys-yWnIFGINgiNF2-KKCyW5ZXVmsxt-LFgkrmvcAsu-b6_3aYSOM_uW',
      audience: 'https://dev-zypdnx4uu6aa115f.us.auth0.com/api/v2/',
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
  const response = await fetch(`https://dev-zypdnx4uu6aa115f.us.auth0.com/api/v2/users/${userId}`, {
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

