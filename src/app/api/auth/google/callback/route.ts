import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/../lib/auth';
import { User } from '@/../lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.APP_URL}/auth/error`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const { access_token } = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userResponse.json();

    // Create user object
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      image: userData.picture,
      provider: 'google',
    };

    // Create session token
    const token = await createToken(user);

    // Set cookie and redirect
    const response = NextResponse.redirect(`${process.env.APP_URL}`);
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.redirect(`${process.env.APP_URL}/auth/error`);
  }
}



