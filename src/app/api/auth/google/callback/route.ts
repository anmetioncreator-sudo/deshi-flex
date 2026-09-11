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
  const baseUrl = getRequestBaseUrl(request);
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    const errorRedirect = new URL('/login', baseUrl);
    errorRedirect.searchParams.set('error', error ? `Google Sign-in declined: ${error}` : 'No authorization code received.');
    return NextResponse.redirect(errorRedirect);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    const missingKeysRedirect = new URL('/login', baseUrl);
    missingKeysRedirect.searchParams.set('error', 'Google OAuth credentials missing on server.');
    return NextResponse.redirect(missingKeysRedirect);
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      const errUrl = new URL('/login', baseUrl);
      errUrl.searchParams.set('error', 'Failed to exchange authorization token with Google.');
      return NextResponse.redirect(errUrl);
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userRes.json();
    if (!userRes.ok || !profile.email) {
      const profileErrUrl = new URL('/login', baseUrl);
      profileErrUrl.searchParams.set('error', 'Unable to retrieve Google user profile.');
      return NextResponse.redirect(profileErrUrl);
    }

    // 3. Construct successful redirect with verified Google credentials
    const successRedirect = new URL('/login', baseUrl);
    successRedirect.searchParams.set('google_auth', 'success');
    successRedirect.searchParams.set('name', profile.name || profile.email.split('@')[0]);
    successRedirect.searchParams.set('email', profile.email);
    if (profile.picture) {
      successRedirect.searchParams.set('avatar', profile.picture);
    }

    return NextResponse.redirect(successRedirect);
  } catch (err: unknown) {
    const errorObj = err as Error;
    console.error('Google callback error:', errorObj);
    const failUrl = new URL('/login', baseUrl);
    failUrl.searchParams.set('error', errorObj.message || 'Google authentication encountered an exception.');
    return NextResponse.redirect(failUrl);
  }
}
