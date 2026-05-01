import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-0.02em' }}>PRsense</h1>
      <p style={{ maxWidth: 560, color: '#9aa3ad', fontSize: '1.125rem' }}>
        AI-powered pull request review, inline on every GitHub PR. Catch risks before reviewers
        do.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Link
          href="/sign-in"
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.625rem 1.25rem',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Sign in
        </Link>
        <a
          href="https://github.com/rafaelasantosfeitosa/prsense"
          style={{
            border: '1px solid #2b313a',
            color: '#e6e8eb',
            padding: '0.625rem 1.25rem',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
