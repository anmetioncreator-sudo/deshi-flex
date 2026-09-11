import { NextResponse } from 'next/server';

function getRequestBaseUrl(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');

  if (host) {
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

export async function GET(request: Request) {
  // Always derive baseUrl from the actual request host so it matches the current domain (e.g. deshiflex.shop)
  const baseUrl = getRequestBaseUrl(request);
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
