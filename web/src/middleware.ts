import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { isClerkConfigured } from './lib/clerk';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) await auth.protect();
    })
  : function middleware(req: NextRequest) {
      if (isProtectedRoute(req)) return NextResponse.redirect(new URL('/', req.url));
      return NextResponse.next();
    };

export const config = {
  matcher: ['/dashboard(.*)'],
};
