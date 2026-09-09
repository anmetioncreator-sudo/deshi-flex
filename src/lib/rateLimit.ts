import { NextRequest } from 'next/server';
import prisma from './prisma';

// In-memory sliding window store for rate limiting
const ipOrderTracker: Map<string, { count: number; timestamps: number[] }> = new Map();

/**
 * Extracts the real client IP address from standard request headers.
 */
export function getClientIp(request: Request | NextRequest): string {
  const headers = request.headers;
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();
  
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}

/**
 * Checks if an IP address has exceeded the maximum order limit (default max 3 orders).
 * Returns { allowed: boolean, currentCount: number, limit: number }
 */
export async function checkIpOrderLimit(ip: string, maxLimit = 3): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
  let dbCount = 0;

  try {
    // Count orders in database matching this IP address
    dbCount = await prisma.order.count({
      where: {
        ipAddress: ip,
        deleted: false,
      },
    });
  } catch (err) {
    console.warn('Prisma IP count lookup fallback:', err);
  }

  // Combine with in-memory tracker
  const memoryRecord = ipOrderTracker.get(ip);
  const memoryCount = memoryRecord ? memoryRecord.count : 0;
  const currentCount = Math.max(dbCount, memoryCount);

  if (currentCount >= maxLimit) {
    return { allowed: false, currentCount, limit: maxLimit };
  }

  return { allowed: true, currentCount, limit: maxLimit };
}

/**
 * Records an order submission from an IP address in memory.
 */
export function recordIpOrder(ip: string) {
  const existing = ipOrderTracker.get(ip) || { count: 0, timestamps: [] };
  existing.count += 1;
  existing.timestamps.push(Date.now());
  ipOrderTracker.set(ip, existing);
}

/**
 * Sanitizes input string to prevent script injection and malicious payload attacks.
 */
export function sanitizeInput(input: any): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}
