import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getWelcomeEmailHtml } from '@/lib/email/templates';

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
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : null;

    // Check if account already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (existing) {
      if (existing.password) {
        return NextResponse.json(
          {
            success: false,
            error: 'An account with this email already exists. Please Sign In with your password.',
          },
          { status: 409 }
        );
      } else {
        // User previously logged in with Google/OTP; link password
        user = await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: cleanName || existing.name,
            phone: cleanPhone || existing.phone,
            password: hashedPassword,
          },
        });
      }
    } else {
      user = await prisma.user.create({
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

          await sendEmail({
            to: cleanEmail,
            from: EMAIL_SENDERS.orders,
            subject: '👑 Welcome to Deshi Flex - Your 15% VIP Streetwear Code',
            html: welcomeHtml,
          });
        } catch (emailErr) {
          console.error('[Welcome Email Dispatch Failed]:', emailErr);
        }
      })();
    }

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
