import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { isClerkConfigured } from '../../../lib/clerk';

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <div className="grid min-h-screen place-items-center px-6 py-12 text-center">
        <div className="card max-w-md">
          <p className="text-sm font-semibold text-brand">Demo mode</p>
          <h1 className="mt-2 text-2xl font-bold">Signup is paused until Clerk is configured</h1>
          <p className="mt-3 text-sm text-fg-muted">
            Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in production to enable
            accounts. The public landing can still be deployed now.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center px-6 py-12">
      <SignUp />
    </div>
  );
}
