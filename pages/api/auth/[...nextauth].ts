import NextAuth, { NextAuthOptions, Session, DefaultSession } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { JWT } from "next-auth/jwt";
import { getCsrfToken } from "next-auth/react";

interface CustomToken {
  idToken?: string;
  refreshToken?: string;
  idTokenExpires?: number;
  error?: string;
}

// Extend the default session type to include the ID token and refresh token
interface CustomSession extends DefaultSession {
  idToken?: string;
  refreshToken?: string;
  error?: string;
}

const options: NextAuthOptions = {
  providers: [
    AzureADB2CProvider({
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME!,
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_POLICY!,
      authorization: {
        params: {
          scope: 'openid offline_access profile email', // Add the scopes here
        },
      },
      profile(profile) {
        // Mapping profile data returned from Azure AD B2C
        console.log(profile)
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.emails ? profile.emails[0] : null,
          // Add additional profile fields as needed
          family_name: profile.family_name,
          given_name: profile.given_name,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT to store session data
  },
    callbacks: {
      async jwt({ token, account }) {
        // When the user logs in, store the ID token and refresh token
        if (account) {  
          console.log("Account object during login:", account);
          token.idToken = account.id_token;
          token.refreshToken = account.refresh_token;
          const decodedToken = jwt.decode(account.id_token as string) as jwt.JwtPayload;
          if (decodedToken?.exp) {
            token.idTokenExpires = decodedToken.exp * 1000; // Set expiration time as a number (in ms)
          } else {
            console.log("No expiration found in the ID token.");
          }
    
          // console.log("Decoded Token Expiration Time:", token.idTokenExpires ? new Date(token.idTokenExpires).toLocaleString() : null);
        }    

        // Check if the token has expired
        if (typeof token.idTokenExpires === 'number' && Date.now() > token.idTokenExpires) {
          console.log("ID Token expired. Refreshing...");
          
          const refreshedToken = await refreshIdToken(token as CustomToken); // Assume `refreshIdToken` function exists
          // console.log(refreshedToken)
          if (refreshedToken) {
            console.log("ID Token refreshed successfully");
            return refreshedToken as unknown as JWT; // Cast refreshedToken to JWT
          }
        }
    
        // Return token if it's still valid
        return token;
      },

      async session({ session, token }) {
        // Pass the ID token and refresh token to the session
        session.idToken = (token as CustomToken).idToken;
        session.refreshToken = (token as CustomToken).refreshToken;
        session.error = (token as CustomToken).error;

        return session as CustomSession;
      },
    },
  };

// Function to refresh the ID token using the refresh token
async function refreshIdToken(token: CustomToken) {
  try {
    // console.log(token.refreshToken)
    const url = `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/B2C_1_signup_signin/oauth2/v2.0/token`;

    const params = new URLSearchParams({
      client_id: process.env.AZURE_AD_B2C_CLIENT_ID!,
      client_secret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
      scope: "openid offline_access profile email",
      refresh_token: token.refreshToken as string,
      grant_type: "refresh_token",
    });
    
    const response = await axios.post(url, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    

    const refreshedTokens = response.data;
    console.log("Response from Azure AD B2C:", refreshedTokens);

    // Decode the new ID token to extract the expiration time
    const decodedToken = jwt.decode(refreshedTokens.id_token) as jwt.JwtPayload;
    return {
      ...token,
      idToken: refreshedTokens.id_token,
      idTokenExpires: decodedToken?.exp ? decodedToken.exp * 1000 : null, // Convert to milliseconds
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Use new refresh token if available
    };
  } catch (error) {
    console.error("Error refreshing ID token:", error);
  }
}

export async function getProfileEditUrl() {
  const csrfToken = await getCsrfToken();
  const url = `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/oauth2/v2.0/authorize?p=${process.env.AZURE_AD_B2C_PROFILE_EDIT_POLICY}&client_id=${process.env.AZURE_AD_B2C_CLIENT_ID}&nonce=defaultNonce&redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/azure-ad-b2c&scope=openid&response_type=id_token`;
  console.log(url);
  return url;
}
export default NextAuth(options)