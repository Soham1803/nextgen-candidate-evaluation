import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // Check if the route requires authentication
  if (request.nextUrl.pathname.startsWith('/protected')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const payload = await verifyToken(token.value);
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/protected/:path*',
};