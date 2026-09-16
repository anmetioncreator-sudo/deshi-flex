import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email required for session synchronization.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const ownerEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'deshiflex12@gmail.com').toLowerCase().trim();

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    const isSystemOwner = cleanEmail === ownerEmail;
    const isDbAdmin = user?.role === 'admin' || user?.role === 'owner';

    if (!isSystemOwner && !isDbAdmin) {
      return NextResponse.json(
        { success: false, error: 'Account does not have administrator privileges.' },
        { status: 403 }
      );
    }

    const role = (user?.role === 'owner' || isSystemOwner) ? 'owner' : 'admin';
    const username = user?.name || cleanEmail;

    // Issue cryptographically signed admin session token
    const token = createSessionToken(role, username, 7);

    const response = NextResponse.json({
      success: true,
      role,
      username,
      message: 'Admin session synchronized successfully.',
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
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error syncing admin session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Session sync failed.' },
      { status: 500 }
    );
  }
}
