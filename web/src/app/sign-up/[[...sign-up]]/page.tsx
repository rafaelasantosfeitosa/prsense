import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-12 text-center">
      <div className="card max-w-md">
        <p className="text-sm font-semibold text-brand">Secure public preview</p>
        <h1 className="mt-2 text-2xl font-bold">Signup is paused</h1>
        <p className="mt-3 text-sm text-fg-muted">
          Public access is limited to the landing page and protected API endpoints while account
          authentication is hardened separately.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
