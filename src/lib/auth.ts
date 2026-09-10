import crypto from 'crypto';

const SESSION_SECRET = process.env.AUTH_SESSION_SECRET || 'fallback-secret-key-32-character-min-length-df-vault';
const COOKIE_NAME = 'df_admin_session';

export interface SessionPayload {
  role: 'admin' | 'owner';
  username: string;
  exp: number; // Unix timestamp in seconds
}

/**
 * Encodes an object to URL-safe Base64.
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Decodes URL-safe Base64 to string.
 */
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Signs data using HMAC-SHA256.
 */
function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

/**
 * Creates a cryptographically signed session token.
 */
export function createSessionToken(role: 'admin' | 'owner', username: string, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const payload: SessionPayload = { role, username, exp };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload, SESSION_SECRET);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed session token.
 */
export function verifySessionToken(token: string): { valid: boolean; role?: 'admin' | 'owner'; username?: string } {
  try {
    if (!token || typeof token !== 'string') return { valid: false };

    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [encodedPayload, signature] = parts;
    const expectedSignature = sign(encodedPayload, SESSION_SECRET);

    // Constant-time signature comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false };
    }

    const payload: SessionPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false };
    }

    return {
      valid: true,
      role: payload.role,
      username: payload.username,
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Extracts and verifies session token from Request or NextRequest.
 */
export function verifyAdminSession(request: Request): { valid: boolean; role?: 'admin' | 'owner'; username?: string } {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );

    const token = cookies[COOKIE_NAME];
    if (!token) return { valid: false };

    return verifySessionToken(token);
  } catch {
    return { valid: false };
  }
}

export { COOKIE_NAME };
