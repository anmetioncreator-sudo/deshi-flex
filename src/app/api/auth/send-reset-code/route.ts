import { NextResponse } from 'next/server';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getResetCodeEmailHtml, getResetCodeEmailText } from '@/lib/email/templates';
import { getClientIp } from '@/lib/rateLimit';
import { generateNumericOtp, storeOtp } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const clientIp = getClientIp(request);
    const resetCode = generateNumericOtp();

    const storeResult = storeOtp(cleanEmail, resetCode, 'reset_password', 15);
    if (!storeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${storeResult.cooldownRemaining || 30}s before requesting a new code.`,
        },
        { status: 429 }
      );
    }

    const html = getResetCodeEmailHtml({
      resetCode,
      email: cleanEmail,
      expiresInMinutes: 15,
      ipAddress: clientIp,
    });
    const text = getResetCodeEmailText({
      resetCode,
      email: cleanEmail,
      expiresInMinutes: 15,
    });

    const result = await sendEmail({
      to: cleanEmail,
      from: EMAIL_SENDERS.support,
      replyTo: 'support@deshiflex.shop',
      subject: `Your Deshi Flex verification code: ${resetCode}`,
      html,
      text,
    });

    return NextResponse.json({
      success: result.success,
      simulated: result.simulated,
      message: 'Reset code successfully dispatched to your email.',
      expiresInMinutes: 15,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error sending reset code:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
