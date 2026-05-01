export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-bg-raised/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-fg-muted sm:flex-row">
        <p>© {new Date().getFullYear()} PRsense. Built for engineering teams.</p>
        <div className="flex gap-6">
          <a href="https://github.com/rafaelasantosfeitosa/prsense" className="hover:text-fg">
            GitHub
          </a>
          <a href="mailto:rafaelasantosfeitosa@gmail.com" className="hover:text-fg">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
