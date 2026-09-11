import { NextResponse } from 'next/server';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getResetCodeEmailHtml } from '@/lib/email/templates';
import { getClientIp } from '@/lib/rateLimit';
import { generateNumericOtp, storeOtp } from '@/lib/otpStore';

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

    return NextResponse.json({
      success: true,
      simulated: result.simulated,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      expiresInMinutes: 10,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while sending code.' },
      { status: 500 }
    );
  }
}
