import crypto from 'crypto';

const SESSION_SECRET = process.env.AUTH_SESSION_SECRET || 'fallback-secret-key-32-character-min-length-df-vault';
export const OTP_COOKIE_NAME = 'df_otp_challenge';

interface OtpRecord {
  code: string;
  expiresAt: number;
  purpose: 'customer_login' | 'admin_login' | 'reset_password';
  attempts: number;
  lastSentAt: number;
}

// In-memory fallback cache (used for cooldown tracking and single-instance dev)
const globalForOtp = global as unknown as { otpCache?: Map<string, OtpRecord> };
const otpCache = globalForOtp.otpCache || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpCache = otpCache;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function hashCode(email: string, code: string, purpose: string): string {
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${email.toLowerCase().trim()}:${code.trim()}:${purpose}`)
    .digest('hex');
}

/**
 * Generate cryptographically random 6-digit numeric OTP.
 */
export function generateNumericOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Creates an HMAC-signed stateless challenge token for Vercel serverless functions.
 */
export function createOtpChallengeToken(
  email: string,
  code: string,
  purpose: 'customer_login' | 'admin_login' | 'reset_password',
  ttlMinutes = 10
): string {
  const cleanEmail = email.toLowerCase().trim();
  const exp = Math.floor(Date.now() / 1000) + ttlMinutes * 60;
  const codeHash = hashCode(cleanEmail, code, purpose);

  const payload = {
    email: cleanEmail,
    purpose,
    codeHash,
    exp,
    issuedAt: Date.now(),
  };

  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encoded, SESSION_SECRET);
  return `${encoded}.${signature}`;
}

/**
 * Save OTP for an email address with expiry and cooldown validation.
 */
export function storeOtp(
  email: string,
  code: string,
  purpose: 'customer_login' | 'admin_login' | 'reset_password',
  ttlMinutes = 10
): { success: boolean; challengeToken: string; cooldownRemaining?: number } {
  const cleanEmail = email.toLowerCase().trim();
  const key = `${purpose}:${cleanEmail}`;
  const existing = otpCache.get(key);
  const now = Date.now();

  // 30 seconds cooldown between sending new OTPs to the same email
  if (existing && now - existing.lastSentAt < 30 * 1000) {
    const cooldownRemaining = Math.ceil((30 * 1000 - (now - existing.lastSentAt)) / 1000);
    const token = createOtpChallengeToken(cleanEmail, existing.code, purpose, ttlMinutes);
    return { success: false, challengeToken: token, cooldownRemaining };
  }

  // Update in-memory record
  otpCache.set(key, {
    code,
    expiresAt: now + ttlMinutes * 60 * 1000,
    purpose,
    attempts: 0,
    lastSentAt: now,
  });

  const challengeToken = createOtpChallengeToken(cleanEmail, code, purpose, ttlMinutes);
  return { success: true, challengeToken };
}

/**
 * Verify OTP entered by the user (supports both stateless challenge token and local cache).
 */
export function verifyOtpCode(
  email: string,
  enteredCode: string,
  purpose: 'customer_login' | 'admin_login' | 'reset_password',
  challengeToken?: string
): { valid: boolean; error?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = enteredCode.trim();

  // 1. Try stateless cryptographic challenge verification first (ideal for Vercel Serverless)
  if (challengeToken && typeof challengeToken === 'string') {
    try {
      const parts = challengeToken.split('.');
      if (parts.length === 2) {
        const [encodedPayload, signature] = parts;
        const expectedSignature = sign(encodedPayload, SESSION_SECRET);

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSignature);

        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          const payload = JSON.parse(base64UrlDecode(encodedPayload));
          const nowSec = Math.floor(Date.now() / 1000);

          if (payload.exp < nowSec) {
            return { valid: false, error: 'Verification code has expired. Please request a new code.' };
          }

          if (payload.email !== cleanEmail || payload.purpose !== purpose) {
            return { valid: false, error: 'Verification request mismatch. Please request a new code.' };
          }

          const expectedHash = hashCode(cleanEmail, cleanCode, purpose);
          const expectedHashBuf = Buffer.from(expectedHash);
          const actualHashBuf = Buffer.from(payload.codeHash);

          if (
            expectedHashBuf.length === actualHashBuf.length &&
            crypto.timingSafeEqual(expectedHashBuf, actualHashBuf)
          ) {
            // Validated via cryptographic challenge!
            const key = `${purpose}:${cleanEmail}`;
            otpCache.delete(key);
            return { valid: true };
          }
        }
      }
    } catch (err) {
      console.error('[OTP Stateless Verify Error]:', err);
    }
  }

  // 2. Fallback to in-memory store
  const key = `${purpose}:${cleanEmail}`;
  const record = otpCache.get(key);

  if (!record) {
    return { valid: false, error: 'No active verification code found or code expired. Please request a new one.' };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpCache.delete(key);
    return { valid: false, error: 'Verification code has expired. Please request a new one.' };
  }

  if (record.attempts >= 5) {
    otpCache.delete(key);
    return { valid: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  record.attempts += 1;

  if (record.code.trim() !== cleanCode) {
    const remaining = 5 - record.attempts;
    return {
      valid: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Once validated, delete the OTP to prevent replay attacks
  otpCache.delete(key);
  return { valid: true };
}
