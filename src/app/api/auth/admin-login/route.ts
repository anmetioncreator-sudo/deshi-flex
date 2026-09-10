import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and access password required.' },
        { status: 400 }
      );
    }

    const adminUser = process.env.ADMIN_USERNAME || 'deshi_admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'DF_Admin#Secure2026!7x';

    const ownerUser = process.env.OWNER_USERNAME || 'deshi_owner';
    const ownerPass = process.env.OWNER_PASSWORD || 'DF_Owner#Vault999!8z';

    let matchedRole: 'owner' | 'admin' | null = null;

    if (safeCompare(username, ownerUser) && safeCompare(password, ownerPass)) {
      matchedRole = 'owner';
    } else if (safeCompare(username, adminUser) && safeCompare(password, adminPass)) {
      matchedRole = 'admin';
    }

    if (!matchedRole) {
      return NextResponse.json(
        { success: false, error: 'Invalid authorized credentials.' },
        { status: 401 }
      );
    }

    // Generate cryptographically signed token
    const token = createSessionToken(matchedRole, username, 7);

    const response = NextResponse.json({
      success: true,
      role: matchedRole,
      username,
    });

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Error during admin authentication:', err);
    return NextResponse.json(
      { success: false, error: 'Internal authentication failure.' },
      { status: 500 }
    );
  }
}
