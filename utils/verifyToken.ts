import jwt from 'jsonwebtoken';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { NextApiRequest } from 'next';

export default interface JwtPayload {
    emails: string[];
    given_name: string;
    family_name: string;
    extension_referralCode?: string;
  }

export async function verifyToken(token: string) {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    // Fetch public keys from Azure B2C discovery endpoint
    const { data } = await axios.get(`https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_AD_B2C_PRIMARY_POLICY}/discovery/v2.0/keys`);
    
    const decodedToken = jwt.decode(token, { complete: true });
    // console.log(decodedToken)
    // Ensure decodedToken is not null
    if (!decodedToken || !decodedToken.header) {
      throw new Error('Invalid token: Unable to decode header');
    }

    const { header } = decodedToken;    
    const jwk = data.keys.find((key:any) => key.kid === header.kid);
    // console.log(jwk)
    if (!jwk) {
      throw new Error('Invalid token: Public key not found');
    }
    
    const publicKey = jwkToPem(jwk);
    
    // Verify the token using the public key
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    // console.log(decoded)
    return { valid: true, decoded };

  } catch (err:any) {
    throw new Error(`Token verification failed: ${err.message}`);
  }
}

export async function authenticateUser(req: NextApiRequest) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    throw new Error('Authorization token is required');
  }
  
  const { valid, decoded } = await verifyToken(token);
  if (!valid) {
    throw new Error('Invalid token');
  }
  
  const payload = decoded as JwtPayload;
  return payload.emails[0];
}
