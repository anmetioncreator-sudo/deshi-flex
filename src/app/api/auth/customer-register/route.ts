import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getWelcomeEmailHtml, getWelcomeEmailText } from '@/lib/email/templates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : null;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role: 'customer',
      },
    });

    // Dispatch welcome email asynchronously with VIP discount code
    (async () => {
      try {
        const welcomeHtml = getWelcomeEmailHtml({
          name: cleanName,
          email: cleanEmail,
          discountCode: 'FLEXDROP',
        });
        const welcomeText = getWelcomeEmailText({
          name: cleanName,
          discountCode: 'FLEXDROP',
        });

        await sendEmail({
          to: cleanEmail,
          from: EMAIL_SENDERS.orders,
          subject: 'Welcome to Deshi Flex - Your 15% VIP Streetwear Code',
          html: welcomeHtml,
          text: welcomeText,
        });
      } catch (emailErr) {
        console.error('[Welcome Email Dispatch Failed]:', emailErr);
      }
    })();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      },
      message: 'Account created successfully! Welcome to Deshi Flex.',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error during customer registration:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed due to a server error.' },
      { status: 500 }
    );
  }
}
