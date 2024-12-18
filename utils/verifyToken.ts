import {decode} from 'jsonwebtoken';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { NextApiRequest } from 'next';

export default interface JwtPayload {
    email: string[];
    given_name: string;
    family_name: string;
    extension_referralCode?: string;
  }

export async function verifyToken(idToken: string) {
  if (!idToken) {
    throw new Error('Token is required');
  }

  try {
    // Fetch public keys from Azure B2C discovery endpoint
    const decodedToken = decode(idToken, { complete: true });
    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    // You can add additional validations like checking issuer, audience, etc.
    return { valid: true, decodedToken };

  } catch (err:any) {
    throw new Error(`Token verification failed: ${err.message}`);
  }
}

export async function authenticateUser(req: NextApiRequest) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  const { valid, decodedToken } = await verifyToken(token);
  if (!valid) {
    throw new Error('Invalid token');
  }
  
  const payload = decodedToken.payload as JwtPayload;
  return payload.email;
}
