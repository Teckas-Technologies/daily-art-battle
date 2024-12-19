import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User from '../../model/User';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const email = session.user.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Replace with your Auth0 domain and client ID
    const AUTH0_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL;
    const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
    const Auth_baseurl = process.env.AUTH0_BASE_URL;
    const redirectUri = encodeURIComponent(`${Auth_baseurl}/api/auth/callback`); // Replace with your actual redirect URI

    const state = encodeURIComponent(JSON.stringify({ referralCode: user.referralCode }));
    const auth0ReferralLink = `${AUTH0_DOMAIN}/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid profile email&state=${state}&referral_code=${user.referralCode}`;

    res.status(200).json({ referralLink: auth0ReferralLink });
  } catch (error) {
    console.error('Error generating referral link:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
