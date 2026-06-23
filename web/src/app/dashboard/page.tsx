import Link from 'next/link';
import { Footer } from '../../components/Footer';
import { Nav } from '../../components/Nav';

export default function DashboardPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 py-16 text-center">
        <div className="card">
          <p className="text-sm font-semibold text-brand">Dashboard locked</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Account dashboard is paused</h1>
          <p className="mt-4 text-fg-muted">
            This public deployment does not expose account data or Clerk authentication yet. The
            dashboard will be enabled only after production auth and persistent quota storage are
            configured.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Back to PRsense
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
