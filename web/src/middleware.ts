import { type NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'prsense.rafasantos.app.br';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.toLowerCase().split(':')[0];

  if (host && host !== CANONICAL_HOST) {
    const url = req.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
