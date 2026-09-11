import { NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/otpStore';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getWelcomeEmailHtml } from '@/lib/email/templates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'customer_login', name, phone, isNewRegistration } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    // Verify OTP
    const verification = verifyOtpCode(cleanEmail, cleanCode, purpose);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    // 1. ADMIN AUTHENTICATION
    if (purpose === 'admin_login') {
      const token = createSessionToken('admin', 'Admin (Email Verified)', 7);
      const response = NextResponse.json({
        success: true,
        role: 'admin',
        username: 'Admin (Email Verified)',
        message: 'Administrative handshake confirmed.',
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

    // 2. CUSTOMER AUTHENTICATION
    const displayName = name ? name.trim() : cleanEmail.split('@')[0];
    const customerUser = {
      id: `usr_${Date.now()}`,
      name: displayName,
      email: cleanEmail,
      phone: phone || '',
      createdAt: new Date().toISOString(),
    };

    // If new registration, send welcome email with discount code asynchronously
    if (isNewRegistration) {
      (async () => {
        try {
          const welcomeHtml = getWelcomeEmailHtml({
            name: displayName,
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
      user: customerUser,
      message: 'Successfully verified! Welcome to Deshi Flex.',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while verifying code.' },
      { status: 500 }
    );
  }
}
