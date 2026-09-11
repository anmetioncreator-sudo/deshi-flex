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
  // Always derive baseUrl from the actual request host so it matches the current domain (e.g. www.deshiflex.shop)
  const baseUrl = getRequestBaseUrl(request);
  const url = new URL(request.url);
  const destination = url.searchParams.get('destination') || 'customer';

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // If Google Client ID is not configured yet in environment, offer graceful demo preview login
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
    const targetPath = destination === 'vault' ? '/df-control-vault/login' : '/login';
    const demoRedirect = new URL(targetPath, baseUrl);
    demoRedirect.searchParams.set('error', 'Google Client credentials not configured in environment.');
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
  // Pass destination state so callback knows whether to authenticate customer or admin vault
  googleAuthUrl.searchParams.set('state', destination);

  return NextResponse.redirect(googleAuthUrl.toString());
}
