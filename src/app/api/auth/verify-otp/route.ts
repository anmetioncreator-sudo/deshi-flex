import { NextResponse } from 'next/server';
import { verifyOtpCode, OTP_COOKIE_NAME } from '@/lib/otpStore';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getWelcomeEmailHtml, getWelcomeEmailText } from '@/lib/email/templates';
import prisma from '@/lib/prisma';

function getCookieValue(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'customer_login', name, phone, isNewRegistration, challengeToken: clientToken } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    // Retrieve challenge token from HTTP-only cookie or client payload
    const challengeToken = clientToken || getCookieValue(request, OTP_COOKIE_NAME);

    // Verify OTP statelessly or via fallback store
    const verification = verifyOtpCode(cleanEmail, cleanCode, purpose, challengeToken);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === 'production';

    // 1. ADMIN AUTHENTICATION
    if (purpose === 'admin_login') {
      const token = createSessionToken('admin', 'Admin (Email Verified)', 7);
      const response = NextResponse.json({
        success: true,
        role: 'admin',
        username: 'Admin (Email Verified)',
        message: 'Administrative handshake confirmed.',
      });

      // Set admin vault session cookie
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      // Clear used challenge cookie
      response.cookies.set({
        name: OTP_COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });

      return response;
    }

    // 2. CUSTOMER AUTHENTICATION
    const displayName = name ? name.trim() : cleanEmail.split('@')[0];
    let customerUser;
    try {
      const dbUser = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          name: displayName,
          ...(phone ? { phone: phone.trim() } : {}),
        },
        create: {
          name: displayName,
          email: cleanEmail,
          phone: phone ? phone.trim() : null,
          role: 'customer',
        },
      });
      customerUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || '',
        createdAt: dbUser.createdAt.toISOString(),
      };
    } catch {
      customerUser = {
        id: `usr_${Date.now()}`,
        name: displayName,
        email: cleanEmail,
        phone: phone || '',
        createdAt: new Date().toISOString(),
      };
    }

    // If new registration, send welcome email with discount code asynchronously
    if (isNewRegistration) {
      (async () => {
        try {
          const welcomeHtml = getWelcomeEmailHtml({
            name: displayName,
            email: cleanEmail,
            discountCode: 'FLEXDROP',
          });

          const welcomeText = getWelcomeEmailText({
            name: displayName,
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
    }

    const response = NextResponse.json({
      success: true,
      user: customerUser,
      message: 'Successfully verified! Welcome to Deshi Flex.',
    });

    // Clear used challenge cookie
    response.cookies.set({
      name: OTP_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while verifying code.' },
      { status: 500 }
    );
  }
}
