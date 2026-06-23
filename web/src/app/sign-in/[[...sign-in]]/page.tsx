import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { isClerkConfigured } from '../../../lib/clerk';

export default function SignInPage() {
  if (!isClerkConfigured) {
    return (
      <div className="grid min-h-screen place-items-center px-6 py-12 text-center">
        <div className="card max-w-md">
          <p className="text-sm font-semibold text-brand">Demo mode</p>
          <h1 className="mt-2 text-2xl font-bold">Auth is not configured yet</h1>
          <p className="mt-3 text-sm text-fg-muted">
            PRsense can run the public landing and review API smoke tests without Clerk. Add Clerk
            keys to enable sign in and the dashboard.
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
      <SignIn />
    </div>
  );
}
