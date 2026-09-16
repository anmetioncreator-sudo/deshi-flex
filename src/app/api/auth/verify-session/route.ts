import { NextResponse } from 'next/server';
import { verifyAdminSession, createSessionToken, COOKIE_NAME } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // 1. Check existing cryptographic admin session cookie
  const session = verifyAdminSession(request);
  if (session.valid && session.role) {
    return NextResponse.json({
      authenticated: true,
      role: session.role,
      username: session.username,
    });
  }

  // 2. If cookie is missing or expired, check if verified account email parameter has admin clearance
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    if (email && email.includes('@')) {
      const ownerEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'deshiflex12@gmail.com').toLowerCase().trim();
      const isSystemOwner = email === ownerEmail;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (isSystemOwner || user?.role === 'admin' || user?.role === 'owner') {
        const role = (isSystemOwner || user?.role === 'owner') ? 'owner' : 'admin';
        const username = user?.name || email;
        const token = createSessionToken(role, username, 7);

        const response = NextResponse.json({
          authenticated: true,
          role,
          username,
        });

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
    }
  } catch (err) {
    console.error('Error during fallback admin session verification:', err);
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
