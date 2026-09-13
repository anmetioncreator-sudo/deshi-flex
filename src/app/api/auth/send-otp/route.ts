import { NextResponse } from 'next/server';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getResetCodeEmailHtml } from '@/lib/email/templates';
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

    const emailSubject =
      purpose === 'admin_login'
        ? `🔐 Admin Vault Access Code: ${otpCode} - Deshi Flex Control`
        : `🔑 Your Deshi Flex Verification Code: ${otpCode}`;

    const result = await sendEmail({
      to: cleanEmail,
      from: EMAIL_SENDERS.orders,
      subject: emailSubject,
      html,
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

    const response = NextResponse.json({
      success: true,
      simulated: result.simulated,
      challengeToken: storeResult.challengeToken,
      // In simulation mode (when RESEND_API_KEY is not configured yet on Vercel), provide devCode so verification doesn't stall
      devCode: result.simulated ? otpCode : undefined,
      message: result.simulated
        ? `[Preview Mode] Verification code generated: ${otpCode}`
        : `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
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
