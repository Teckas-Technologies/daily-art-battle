import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Fetch token using next-auth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if token exists
  if (!token) {
    // Redirect to login page if not authenticated
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  // Allow the request to continue if authenticated
  return NextResponse.next();
}

// Protect specific routes with matcher
export const config = {
  matcher: ['/page'],  // This protects 'src/app/page.tsx'
};
