import { type NextRequest, NextResponse } from 'next/server';

const JSON_CONTENT_TYPES = ['application/json', 'application/problem+json'];

export function noStoreJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      Pragma: 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function hasJsonContentType(req: NextRequest): boolean {
  const contentType = req.headers.get('content-type')?.toLowerCase() ?? '';
  return JSON_CONTENT_TYPES.some((type) => contentType.startsWith(type));
}

export function contentLengthExceeds(req: NextRequest, maxBytes: number): boolean {
  const raw = req.headers.get('content-length');
  if (!raw) return false;
  const length = Number.parseInt(raw, 10);
  return Number.isFinite(length) && length > maxBytes;
}

export function clientIp(req: NextRequest): string {
  const directIp =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-vercel-forwarded-for') ??
    req.headers.get('cf-connecting-ip');
  if (directIp) return directIp.trim();

  const forwarded = req.headers
    .get('x-forwarded-for')
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .at(-1);

  return forwarded || 'unknown';
}
