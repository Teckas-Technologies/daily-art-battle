import { NextApiRequest, NextApiResponse } from "next";

export async function validateUser(req: NextApiRequest): Promise<boolean> {
  const clientId = req.headers["x-client-id"];
  const clientSecret = req.headers["x-client-secret"];
  // Validate credentials
  if (
    clientId === process.env.NEXT_PUBLIC_VALID_CLIENT_ID &&
    clientSecret === process.env.NEXT_PUBLIC_VALID_CLIENT_SECRET
  ) {
    return true; // Authentication successful
  }

  throw new Error('Invalid id and secret');
}
