import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-12 text-center">
      <div className="card max-w-md">
        <p className="text-sm font-semibold text-brand">Secure public preview</p>
        <h1 className="mt-2 text-2xl font-bold">Accounts are paused</h1>
        <p className="mt-3 text-sm text-fg-muted">
          PRsense is currently available as a public landing page and extension API preview. Account
          login will be enabled only after production Clerk credentials are configured and reviewed.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
