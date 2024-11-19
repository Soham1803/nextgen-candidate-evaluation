import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/../lib/auth';
import { User, GitHubEmail } from '@/../lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.APP_URL}/auth/error`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_ID,
        client_secret: process.env.GITHUB_SECRET,
        code,
      }),
    });

    const { access_token } = await tokenResponse.json();

    // Get user data
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();

    // Get user email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    const emails: GitHubEmail[] = await emailResponse.json();
    const primaryEmail = emails.find((email) => email.primary)?.email;

    if (!primaryEmail) {
      throw new Error('Primary email not found');
    }

    // Create user object
    const user: User = {
      id: userData.id.toString(),
      email: primaryEmail,
      name: userData.name || userData.login,
      image: userData.avatar_url,
      provider: 'github',
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
    console.error('GitHub OAuth Error:', error);
    return NextResponse.redirect(`${process.env.APP_URL}/auth/error`);
  }
}