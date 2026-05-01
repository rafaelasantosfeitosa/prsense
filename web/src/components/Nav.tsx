import Link from 'next/link';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand font-bold text-white">
            P
          </span>
          PRsense
        </Link>
        <div className="flex items-center gap-6 text-sm text-fg-muted">
          <Link href="/#features" className="hover:text-fg">
            Features
          </Link>
          <Link href="/#pricing" className="hover:text-fg">
            Pricing
          </Link>
          <a
            href="https://github.com/rafaelasantosfeitosa/prsense"
            className="hover:text-fg"
            rel="noreferrer"
          >
            GitHub
          </a>
          <Link href="/sign-in" className="btn-secondary !px-4 !py-2 text-sm">
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
