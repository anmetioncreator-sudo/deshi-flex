import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // If Google Client ID is not configured yet in environment, offer graceful demo preview login
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
    const demoRedirect = new URL('/login', baseUrl);
    demoRedirect.searchParams.set('google_status', 'demo_ready');
    return NextResponse.redirect(demoRedirect);
  }

  // Construct Google OAuth 2.0 Authorization Endpoint
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl.toString());
}
