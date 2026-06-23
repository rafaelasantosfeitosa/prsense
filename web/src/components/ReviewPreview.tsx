export function ReviewPreview() {
  return (
    <div className="card overflow-hidden p-0 shadow-2xl shadow-brand/10">
      <div className="flex items-center justify-between border-b border-border bg-bg-elevated px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded bg-brand text-[10px] font-bold text-white">
            P
          </span>
          <span className="text-sm font-semibold">PRsense</span>
        </div>
        <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand">
          Reviewed in 3.2s
        </span>
      </div>

      <div className="space-y-4 p-5 text-sm">
        <p className="text-fg-muted">
          Adds JWT-based session middleware. Solid implementation; two correctness risks in token
          expiry comparison and one missing test path.
        </p>

        <div className="flex items-center gap-3 text-xs text-fg-muted">
          <span>Complexity</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
            <div className="h-full w-[58%] bg-brand" />
          </div>
          <span className="font-mono text-fg">58/100</span>
        </div>

        <div className="space-y-2">
          <RiskRow
            severity="high"
            file="src/auth/middleware.ts:42"
            title="Token expiry uses < instead of <="
            suggestion="Tokens expiring exactly at boundary are accepted. Use <= for strict bound."
          />
          <RiskRow
            severity="medium"
            file="src/auth/jwt.ts:18"
            title="Secret read at module load"
            suggestion="Lazy-load to avoid crash when env loads after import."
          />
          <RiskRow
            severity="low"
            file="tests/auth.test.ts"
            title="No test for refresh path"
            suggestion="Add coverage for token refresh near expiry boundary."
          />
        </div>
      </div>
    </div>
  );
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-amber-500',
  low: 'border-l-sky-500',
};

function RiskRow({
  severity,
  file,
  title,
  suggestion,
}: {
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  title: string;
  suggestion: string;
}) {
  return (
    <div className={`rounded-md border-l-2 bg-bg-elevated/60 p-3 ${SEVERITY_COLOR[severity]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{title}</span>
        <span className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] uppercase text-fg-muted">
          {severity}
        </span>
      </div>
      <div className="mt-1 font-mono text-xs text-fg-muted">{file}</div>
      <div className="mt-1.5 text-xs text-fg-muted">→ {suggestion}</div>
    </div>
  );
}
