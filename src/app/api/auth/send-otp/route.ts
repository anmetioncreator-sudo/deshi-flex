import { NextResponse } from 'next/server';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getResetCodeEmailHtml, getResetCodeEmailText } from '@/lib/email/templates';
import { getClientIp } from '@/lib/rateLimit';
import { generateNumericOtp, storeOtp, OTP_COOKIE_NAME } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, purpose = 'customer_login' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Security check for administrative vault access
    const adminEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'deshiflex12@gmail.com').toLowerCase().trim();
    if (purpose === 'admin_login' && cleanEmail !== adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized email address for vault access.' },
        { status: 403 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = generateNumericOtp();
    const storeResult = storeOtp(cleanEmail, otpCode, purpose, 10);

    if (!storeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${storeResult.cooldownRemaining || 30} seconds before requesting another code.`,
        },
        { status: 429 }
      );
    }

    const clientIp = getClientIp(request);
    const html = getResetCodeEmailHtml({
      resetCode: otpCode,
      email: cleanEmail,
      expiresInMinutes: 10,
      ipAddress: clientIp,
    });
    const text = getResetCodeEmailText({
      resetCode: otpCode,
      email: cleanEmail,
      expiresInMinutes: 10,
    });

    const emailSubject =
      purpose === 'admin_login'
        ? `Deshi Flex Admin verification code: ${otpCode}`
        : `Your Deshi Flex verification code: ${otpCode}`;

    const result = await sendEmail({
      to: cleanEmail,
      from: EMAIL_SENDERS.support,
      replyTo: 'support@deshiflex.shop',
      subject: emailSubject,
      html,
      text,
    });

    if (!result.success && !result.simulated) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to dispatch verification email. Please verify email settings.',
        },
        { status: 500 }
      );
    }

    if (result.simulated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email delivery service is not configured (RESEND_API_KEY is missing). Please set your Resend API key to deliver verification emails.',
        },
        { status: 503 }
      );
    }

    const response = NextResponse.json({
      success: true,
      challengeToken: storeResult.challengeToken,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      expiresInMinutes: 10,
    });

    // Set secure HTTP-only cookie with the stateless signed OTP challenge
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set({
      name: OTP_COOKIE_NAME,
      value: storeResult.challengeToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60,
    });

    return response;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while sending code.' },
      { status: 500 }
    );
  }
}
