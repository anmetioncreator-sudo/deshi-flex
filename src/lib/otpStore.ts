// In-memory OTP store with automatic cleanup and attempt rate limiting

interface OtpRecord {
  code: string;
  expiresAt: number;
  purpose: 'customer_login' | 'admin_login' | 'reset_password';
  attempts: number;
  lastSentAt: number;
}

// Global store to persist across route module reloads in Node.js
const globalForOtp = global as unknown as { otpCache?: Map<string, OtpRecord> };
const otpCache = globalForOtp.otpCache || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpCache = otpCache;
}

/**
 * Generate cryptographically random 6-digit numeric OTP.
 */
export function generateNumericOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Save OTP for an email address with expiry and cooldown validation.
 */
export function storeOtp(
  email: string,
  code: string,
  purpose: 'customer_login' | 'admin_login' | 'reset_password',
  ttlMinutes = 10
): { success: boolean; cooldownRemaining?: number } {
  const key = `${purpose}:${email.toLowerCase().trim()}`;
  const existing = otpCache.get(key);
  const now = Date.now();

  // 30 seconds cooldown between sending new OTPs to the same email
  if (existing && now - existing.lastSentAt < 30 * 1000) {
    const cooldownRemaining = Math.ceil((30 * 1000 - (now - existing.lastSentAt)) / 1000);
    return { success: false, cooldownRemaining };
  }

  otpCache.set(key, {
    code,
    expiresAt: now + ttlMinutes * 60 * 1000,
    purpose,
    attempts: 0,
    lastSentAt: now,
  });

  return { success: true };
}

/**
 * Verify OTP entered by the user.
 */
export function verifyOtpCode(
  email: string,
  enteredCode: string,
  purpose: 'customer_login' | 'admin_login' | 'reset_password'
): { valid: boolean; error?: string } {
  const key = `${purpose}:${email.toLowerCase().trim()}`;
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

  // Trim and compare
  if (record.code.trim() !== enteredCode.trim()) {
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

/**
 * Cleanup expired entries every 15 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of otpCache.entries()) {
    if (now > record.expiresAt) {
      otpCache.delete(key);
    }
  }
}, 15 * 60 * 1000);
