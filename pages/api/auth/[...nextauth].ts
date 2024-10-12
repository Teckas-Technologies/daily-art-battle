// import NextAuth, { NextAuthOptions, Session, DefaultSession } from "next-auth";
// import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
// import axios from "axios";

// interface CustomToken {
//   idToken?: string;
//   refreshToken?: string;
//   idTokenExpires?: number;
//   error?: string;
// }

// // Extend the default session type to include the ID token and refresh token
// interface CustomSession extends DefaultSession {
//   idToken?: string;
//   refreshToken?: string;
//   error?: string;
// }

// const options: NextAuthOptions = {
//   providers: [
//     AzureADB2CProvider({
//       clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
//       clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
//       tenantId: process.env.AZURE_AD_B2C_TENANT_NAME!,
//       primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_POLICY!,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: `${profile.given_name} ${profile.family_name}`,
//           email: profile.emails ? profile.emails[0] : null,
//         };
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt", // Use JWT to store session data
//   },
//   callbacks: {
//     async jwt({ token, account }) {
//       // When the user logs in, store the ID token and refresh token
//       console.log(account)
//       if (account) {
//         token.idToken = account.id_token;
//         token.refreshToken = account.refresh_token;
//         token.idTokenExpires = Date.now() + account.expires_in * 1000; // Set expiration time
//       }

//       // Check if the token has expired
//       if (token.idTokenExpires && Date.now() > token.idTokenExpires) {
//         console.log("ID Token expired. Refreshing...");
//         const refreshedToken = await refreshIdToken(token as CustomToken);

//         // If refreshing the token failed, return an error and invalidate the session
//         if (refreshedToken.error) {
//           console.log("Failed to refresh ID token");
//           return { ...token, error: refreshedToken.error };
//         }

//         console.log("ID Token refreshed successfully");
//         return refreshedToken;
//       }
//       // Return token if it's still valid
//       return token;
//     },

//     async session({ session, token }) {
//       // Pass the ID token and refresh token to the session
//       session.idToken = (token as CustomToken).idToken;
//       session.refreshToken = (token as CustomToken).refreshToken;
//       session.error = (token as CustomToken).error;

//       return session as CustomSession;
//     },
//   },
// };

// // Function to refresh the ID token using the refresh token
// async function refreshIdToken(token: CustomToken) {
//   try {
//     const url = `https://login.microsoftonline.com/${process.env.AZURE_AD_B2C_TENANT_NAME}/oauth2/v2.0/token`;
//     const params = new URLSearchParams({
//       client_id: process.env.AZURE_AD_B2C_CLIENT_ID!,
//       client_secret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
//       scope: "openid offline_access profile", // Include offline_access to get a refresh token
//       refresh_token: token.refreshToken!,
//       grant_type: "refresh_token",
//     });

//     const response = await axios.post(url, params.toString(), {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     const refreshedTokens = response.data;

//     // Return the new ID token and update expiration time
//     return {
//       ...token,
//       idToken: refreshedTokens.id_token,
//       idTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Update refresh token if a new one is returned
//     };
//   } catch (error) {
//     console.error("Error refreshing ID token:", error);
//     return {
//       ...token,
//       error: "RefreshIdTokenError", // Store the error if refreshing fails
//     };
//   }
// }

// export default NextAuth(options);
