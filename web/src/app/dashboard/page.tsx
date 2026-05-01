import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';

export const dynamic = 'force-dynamic';

interface ReviewRow {
  id: string;
  repo: string;
  pr: number;
  title: string;
  complexity: number;
  risks: number;
  createdAt: string;
}

const MOCK_HISTORY: ReviewRow[] = [
  { id: '1', repo: 'rafaelasantosfeitosa/prsense', pr: 12, title: 'feat: add review history endpoint', complexity: 42, risks: 2, createdAt: '2 hours ago' },
  { id: '2', repo: 'acme/api', pr: 184, title: 'fix: jwt expiry off-by-one', complexity: 18, risks: 1, createdAt: 'yesterday' },
  { id: '3', repo: 'acme/api', pr: 183, title: 'refactor: extract billing service', complexity: 71, risks: 5, createdAt: '2 days ago' },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const user = await currentUser();
  const name = user?.firstName ?? user?.username ?? 'there';

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}.</h1>
            <p className="mt-1 text-fg-muted">Your recent PR reviews.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-bg-raised px-4 py-2 text-sm text-fg-muted">
            <span className="text-fg">3</span> / 5 reviews used this month
          </div>
        </header>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-bg-raised">
          <table className="w-full text-sm">
            <thead className="bg-bg-elevated text-left text-xs uppercase tracking-wide text-fg-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Repository</th>
                <th className="px-5 py-3 font-medium">Pull request</th>
                <th className="px-5 py-3 font-medium">Complexity</th>
                <th className="px-5 py-3 font-medium">Risks</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_HISTORY.map((r) => (
                <tr key={r.id} className="border-t border-border/60 transition hover:bg-bg-elevated/60">
                  <td className="px-5 py-4 font-mono text-xs text-fg-muted">{r.repo}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-fg-muted">#{r.pr}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-bg-elevated">
                        <div className="h-full bg-brand" style={{ width: `${r.complexity}%` }} />
                      </div>
                      <span className="font-mono text-xs">{r.complexity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-bg-elevated px-2 py-0.5 text-xs">{r.risks}</span>
                  </td>
                  <td className="px-5 py-4 text-fg-muted">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-fg-subtle">
          Note: review history is mocked. Persistence ships in the next milestone.
        </p>
      </main>
      <Footer />
    </>
  );
}
