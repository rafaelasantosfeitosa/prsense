export const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const clerkSecretKey = process.env.CLERK_SECRET_KEY;
export const isClerkEnabled = process.env.NEXT_PUBLIC_ENABLE_CLERK === 'true';

export const isClerkConfigured = Boolean(isClerkEnabled && clerkPublishableKey && clerkSecretKey);
