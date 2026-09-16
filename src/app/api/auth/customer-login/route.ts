import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email. Please sign up.' },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'This account was registered via Google or One-Time Code. Please sign in using that method.',
        },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'customer',
      },
      message: `Welcome back, ${user.name.split(' ')[0]}!`,
    });

    if (user.role === 'admin' || user.role === 'owner') {
      const isProduction = process.env.NODE_ENV === 'production';
      const adminToken = createSessionToken(
        user.role as 'admin' | 'owner',
        user.name || user.email,
        7
      );
      response.cookies.set({
        name: COOKIE_NAME,
        value: adminToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error during customer login:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed due to a server error.' },
      { status: 500 }
    );
  }
}
