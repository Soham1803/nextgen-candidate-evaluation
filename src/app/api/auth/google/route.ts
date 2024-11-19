import { NextResponse } from 'next/server';

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'email profile',
    prompt: 'select_account',
  });

  return NextResponse.redirect(`${GOOGLE_OAUTH_URL}?${params.toString()}`);
}