import Link from 'next/link';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';
import { ReviewPreview } from '../components/ReviewPreview';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_55%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-raised px-3 py-1 text-xs text-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Live on Chrome Web Store soon
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            AI code review,
            <br />
            <span className="bg-gradient-to-r from-brand to-sky-400 bg-clip-text text-transparent">
              inline on every PR.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-fg-muted">
            PRsense reviews your pull requests the moment you open them on GitHub. Risks, complexity
            score, and clarifying questions — right next to the diff.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/sign-up" className="btn-primary">
              Install free
            </Link>
            <a
              href="https://github.com/rafaelasantosfeitosa/prsense"
              className="btn-secondary"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
          <p className="mt-4 text-sm text-fg-subtle">
            Free tier: 5 reviews/month · No credit card required
          </p>
        </div>
        <div className="lg:pl-8">
          <ReviewPreview />
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: 'Structured findings',
      body: 'Every review returns typed risks (severity, category, file, line) — not free-form prose.',
    },
    {
      title: 'Reviewer-ready questions',
      body: 'PRsense generates the clarifying questions a senior reviewer would ask the author.',
    },
    {
      title: 'Complexity score',
      body: 'A 0–100 estimate of review effort, so you can route PRs to the right reviewer.',
    },
    {
      title: 'Privacy-first',
      body: 'Your token lives in extension storage, never the page. Diffs are sent over TLS only when you click Review.',
    },
    {
      title: 'Powered by Gemini Flash',
      body: 'Routed through OpenRouter for low latency and cost. Model upgrades are server-side.',
    },
    {
      title: 'Open spec',
      body: 'Review schema is published as a typed package — fork it, extend it, integrate it into your CI.',
    },
  ];
  return (
    <section id="features" className="border-t border-border/60 bg-bg-raised/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Built for engineers who actually merge code.
        </h2>
        <p className="mt-3 max-w-2xl text-fg-muted">
          PRsense is not a comment bot. It is a structured second opinion on the diff in front of
          you.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="card transition hover:border-brand/40">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', t: 'Install the extension', d: 'Two clicks from the Chrome Web Store.' },
    {
      n: '02',
      t: 'Open any GitHub PR',
      d: 'PRsense panel mounts in a Shadow DOM, no GitHub UI changes.',
    },
    {
      n: '03',
      t: 'Click Review',
      d: 'Diff is sent to PRsense, which calls Gemini Flash and returns structured findings.',
    },
  ];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card">
              <div className="font-mono text-sm text-brand">{s.n}</div>
              <h3 className="mt-2 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-fg-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 bg-bg-raised/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing</h2>
        <p className="mt-3 text-fg-muted">Start free. Upgrade when your team grows.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <PriceCard
            name="Free"
            price="$0"
            tagline="For solo devs."
            features={[
              '5 reviews / month',
              'Gemini Flash',
              'Public + private repos',
              'Community support',
            ]}
            cta="Get started"
            href="/sign-up"
          />
          <PriceCard
            name="Pro"
            price="$12"
            tagline="For teams shipping daily."
            features={['Unlimited reviews', 'Priority queue', 'Review history', 'Email support']}
            cta="Start Pro"
            href="/sign-up?plan=pro"
            highlight
          />
        </div>
      </div>
    </section>
  );
}

function PriceCard({
  name,
  price,
  tagline,
  features,
  cta,
  href,
  highlight,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card relative ${highlight ? 'border-brand/60 shadow-xl shadow-brand/10' : ''}`}
    >
      {highlight && (
        <span className="absolute -top-3 right-6 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      )}
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-fg-muted">{tagline}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-fg-muted">/mo</span>
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-fg-muted">
            <span className="text-brand">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-6 block text-center ${highlight ? 'btn-primary' : 'btn-secondary'}`}
      >
        {cta}
      </Link>
    </div>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-to-br from-bg-raised to-bg-elevated p-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Stop merging blind.</h2>
        <p className="mt-3 text-fg-muted">
          Install PRsense and get a structured AI review on your next pull request.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/sign-up" className="btn-primary">
            Install free
          </Link>
        </div>
      </div>
    </section>
  );
}
