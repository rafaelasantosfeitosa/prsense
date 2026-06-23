import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isClerkConfigured } from './lib/clerk';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isExtensionApi = createRouteMatcher(['/api/review', '/api/auth/github/exchange']);

export default clerkMiddleware(async (auth, req) => {
  if (isExtensionApi(req)) return;

  if (!isClerkConfigured) {
    if (isProtectedRoute(req)) return NextResponse.redirect(new URL('/', req.url));
    return;
  }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
};
