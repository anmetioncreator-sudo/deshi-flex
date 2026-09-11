import { NextResponse } from 'next/server';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getSupportInquiryEmailHtml } from '@/lib/email/templates';
import { getClientIp, sanitizeInput } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const fullName = sanitizeInput(data.fullName || data.name || 'Customer');
    const email = sanitizeInput(data.email || '');
    const subject = sanitizeInput(data.subject || 'General Inquiry');
    const message = sanitizeInput(data.message || '');
    const phone = sanitizeInput(data.phone || '');

    if (!email || !email.includes('@') || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    const ticketId = `TCK-${Date.now().toString().slice(-6)}`;
    const clientIp = getClientIp(request);

    // 1. Send confirmation ticket email to customer from support@deshiflex.com
    const customerHtml = getSupportInquiryEmailHtml({
      ticketId,
      fullName,
      email,
      subject,
      message,
    });

    await sendEmail({
      to: email,
      from: EMAIL_SENDERS.support,
      replyTo: EMAIL_SENDERS.adminNotification,
      subject: `Support Ticket Received: #${ticketId} - Deshi Flex Support`,
      html: customerHtml,
    });

    // 2. Alert store admin / owner at deshiflex12@gmail.com
    if (EMAIL_SENDERS.adminNotification) {
      const adminNoticeHtml = `
        <div style="font-family: sans-serif; background: #111; color: #fff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #10b981; margin-top: 0;">New Support Inquiry (#${ticketId})</h2>
          <p><strong>From:</strong> ${fullName} &lt;${email}&gt;</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #222; padding: 15px; border-radius: 8px; margin: 15px 0;">
            ${message}
          </div>
          <p style="font-size: 11px; color: #888;">Origin IP: ${clientIp}</p>
        </div>
      `;

      await sendEmail({
        to: EMAIL_SENDERS.adminNotification,
        from: EMAIL_SENDERS.support,
        replyTo: email,
        subject: `📩 [Support Ticket #${ticketId}] ${subject} - from ${fullName}`,
        html: adminNoticeHtml,
      });
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Your inquiry has been submitted. Check your inbox for confirmation.',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
