import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isExtensionApi = createRouteMatcher(['/api/review', '/api/auth/github/exchange']);

export default clerkMiddleware(async (auth, req) => {
  if (isExtensionApi(req)) return;
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
};
