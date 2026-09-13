import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      },
      message: `Welcome back, ${user.name.split(' ')[0]}!`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error during customer login:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed due to a server error.' },
      { status: 500 }
    );
  }
}
