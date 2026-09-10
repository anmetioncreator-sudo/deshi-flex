import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminSession, createSessionToken, COOKIE_NAME } from '@/lib/auth';

function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const session = verifyAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { passcode } = await request.json();
    const ownerPass = process.env.OWNER_PASSWORD || 'DF_Owner#Vault999!8z';

    if (!safeCompare(passcode, ownerPass)) {
      return NextResponse.json({ success: false, error: 'Invalid Owner passcode.' }, { status: 403 });
    }

    const token = createSessionToken('owner', session.username || 'deshi_owner', 7);
    const response = NextResponse.json({ success: true, role: 'owner' });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
