import { Resend } from 'resend';

// Initialize Resend client only if API key is provided
const apiKey = process.env.RESEND_API_KEY?.trim();
export const resend = apiKey ? new Resend(apiKey) : null;

export const EMAIL_SENDERS = {
  orders: process.env.RESEND_FROM_ORDERS || 'Deshi Flex Official <orders@deshiflex.shop>',
  support: process.env.RESEND_FROM_SUPPORT || 'Deshi Flex Support <support@deshiflex.shop>',
  adminNotification: process.env.ADMIN_NOTIFICATION_EMAIL || 'deshiflex12@gmail.com',
};

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Robust email sender using Resend.
 * If RESEND_API_KEY is not configured, runs in safe simulation mode
 * to avoid breaking checkouts or user actions in development.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const rawFrom = options.from || EMAIL_SENDERS.orders;
  const from = rawFrom.replace(/\^/g, '').trim();
  const replyTo = options.replyTo || (from.includes('support') ? EMAIL_SENDERS.adminNotification : undefined);

  if (!resend) {
    console.warn(
      `[Resend Simulated Dispatch] No RESEND_API_KEY detected in environment.\n` +
      `  To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}\n` +
      `  From: ${from}\n` +
      `  Subject: "${options.subject}"\n` +
      `  Set RESEND_API_KEY in .env to deliver live emails.`
    );
    return {
      success: true,
      simulated: true,
      id: `sim_${Date.now()}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo,
      tags: options.tags,
    });

    if (error) {
      console.error('[Resend Error]', error);
      // If custom domain is not verified yet, automatically retry using onboarding@resend.dev
      if (error.message?.toLowerCase().includes('domain') && !from.includes('resend.dev')) {
        console.warn('[Resend] Custom domain not verified yet. Retrying with onboarding@resend.dev fallback...');
        const fallback = await resend.emails.send({
          from: 'Deshi Flex <onboarding@resend.dev>',
          to: options.to,
          subject: options.subject,
          html: options.html,
          replyTo,
          tags: options.tags,
        });
        if (!fallback.error) {
          return { success: true, id: fallback.data?.id };
        }
      }
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Resend Exception]', error);
    if (error.message?.toLowerCase().includes('domain') && !from.includes('resend.dev') && resend) {
      try {
        const fallback = await resend.emails.send({
          from: 'Deshi Flex <onboarding@resend.dev>',
          to: options.to,
          subject: options.subject,
          html: options.html,
          replyTo,
          tags: options.tags,
        });
        if (!fallback.error) {
          return { success: true, id: fallback.data?.id };
        }
      } catch {}
    }
    return { success: false, error: error.message || 'Failed to dispatch email' };
  }
}
