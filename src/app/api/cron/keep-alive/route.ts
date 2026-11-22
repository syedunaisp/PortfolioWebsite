import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Constant-time string comparison to prevent timing attacks
 */
function isValidSecret(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const bufA = Buffer.from(provided);
  const bufB = Buffer.from(expected);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  // 1. Guard against unconfigured secret on server
  if (!cronSecret) {
    console.error('[cron/keep-alive] CRON_SECRET is not configured in environment variables.');
    return NextResponse.json(
      { ok: false, error: 'Server configuration error' },
      { status: 500, headers: noCacheHeaders }
    );
  }

  // 2. Validate Authorization header: "Bearer <token>" or "x-cron-secret"
  const authHeader = request.headers.get('authorization');
  const customHeader = request.headers.get('x-cron-secret');

  let token = '';
  if (authHeader) {
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    token = bearerMatch ? bearerMatch[1].trim() : authHeader.trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (!token || !isValidSecret(token, cronSecret)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  // 3. Perform a lightweight, read-only query on an existing table with a strict timeout
  const start = Date.now();
  const TIMEOUT_MS = 8000;

  try {
    const queryPromise = prisma.project.findFirst({
      select: { id: true },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), TIMEOUT_MS)
    );

    await Promise.race([queryPromise, timeoutPromise]);
    const latencyMs = Date.now() - start;

    return NextResponse.json(
      {
        ok: true,
        status: 'active',
        timestamp: new Date().toISOString(),
        latencyMs,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    // Log server-side for diagnostics without exposing credentials
    console.error(
      '[cron/keep-alive] Database keep-alive ping failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      {
        ok: false,
        status: 'unavailable',
        timestamp: new Date().toISOString(),
        error: 'Database unavailable',
      },
      {
        status: 503,
        headers: noCacheHeaders,
      }
    );
  }
}
