import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

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
  const state = url.searchParams.get('state') || 'customer';
  const isVaultAuth = state === 'vault';
  const defaultErrorPath = isVaultAuth ? '/df-control-vault/login' : '/login';

  if (error || !code) {
    const errorRedirect = new URL(defaultErrorPath, baseUrl);
    errorRedirect.searchParams.set('error', error ? `Google Sign-in declined: ${error}` : 'No authorization code received.');
    return NextResponse.redirect(errorRedirect);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    const missingKeysRedirect = new URL(defaultErrorPath, baseUrl);
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
      const errUrl = new URL(defaultErrorPath, baseUrl);
      errUrl.searchParams.set('error', 'Failed to exchange authorization token with Google.');
      return NextResponse.redirect(errUrl);
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userRes.json();
    if (!userRes.ok || !profile.email) {
      const profileErrUrl = new URL(defaultErrorPath, baseUrl);
      profileErrUrl.searchParams.set('error', 'Unable to retrieve Google user profile.');
      return NextResponse.redirect(profileErrUrl);
    }

    const email = profile.email.toLowerCase().trim();
    const displayName = profile.name || email.split('@')[0];

    // 3. Handle Admin Control Vault Google Authentication
    if (isVaultAuth) {
      const adminEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'deshiflex12@gmail.com').toLowerCase().trim();
      if (email !== adminEmail) {
        const unauthRedirect = new URL('/df-control-vault/login', baseUrl);
        unauthRedirect.searchParams.set(
          'error',
          `Access Denied: ${email} is not authorized for Vault operations.`
        );
        return NextResponse.redirect(unauthRedirect);
      }

      // Valid admin Google account! Set encrypted HMAC admin session cookie
      const token = createSessionToken('admin', `Google Admin (${displayName})`, 7);
      const vaultRedirect = new URL('/df-control-vault', baseUrl);
      const response = NextResponse.redirect(vaultRedirect);

      const isProduction = process.env.NODE_ENV === 'production';
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 4. Handle Customer Storefront Google Authentication
    const successRedirect = new URL('/login', baseUrl);
    successRedirect.searchParams.set('google_auth', 'success');
    successRedirect.searchParams.set('name', displayName);
    successRedirect.searchParams.set('email', email);
    if (profile.picture) {
      successRedirect.searchParams.set('avatar', profile.picture);
    }

    return NextResponse.redirect(successRedirect);
  } catch (err: unknown) {
    const errorObj = err as Error;
    console.error('Google callback error:', errorObj);
    const failUrl = new URL(defaultErrorPath, baseUrl);
    failUrl.searchParams.set('error', errorObj.message || 'Google authentication encountered an exception.');
    return NextResponse.redirect(failUrl);
  }
}
