import type { Review } from '@prsense/shared';

const PANEL_ID = 'prsense-panel-host';

export interface PanelHandle {
  setLoading(message: string): void;
  setError(message: string): void;
  setReview(review: Review): void;
  destroy(): void;
}

export function mountPanel(onReview: () => void): PanelHandle {
  const existing = document.getElementById(PANEL_ID);
  if (existing) existing.remove();

  const host = document.createElement('div');
  host.id = PANEL_ID;
  host.style.cssText =
    'position:fixed;top:80px;right:24px;width:380px;max-height:70vh;z-index:2147483647;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .panel {
      font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f1115; color: #e6e8eb; border: 1px solid #2b313a;
      border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      overflow: hidden; display: flex; flex-direction: column; max-height: 70vh;
    }
    .header { display:flex; align-items:center; justify-content:space-between;
      padding: 12px 14px; border-bottom: 1px solid #2b313a; background: #11141a; }
    .title { font-weight: 600; }
    .body { padding: 12px 14px; overflow-y: auto; }
    button { font: inherit; cursor: pointer; padding: 6px 12px;
      border-radius: 6px; border: 1px solid #2b313a; background: #1a1f27; color: #e6e8eb; }
    button.primary { background: #3b82f6; border-color: #3b82f6; color: white; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .risk { padding: 8px; margin: 6px 0; border-left: 3px solid #f59e0b;
      background: #161a21; border-radius: 4px; }
    .risk.high { border-color: #f97316; }
    .risk.critical { border-color: #ef4444; }
    .meta { color: #9aa3ad; font-size: 12px; }
    .err { color: #ef4444; }
    h4 { margin: 12px 0 6px; font-size: 13px; text-transform: uppercase;
      letter-spacing: 0.05em; color: #9aa3ad; }
  `;

  const root = document.createElement('div');
  root.className = 'panel';
  root.innerHTML = `
    <div class="header">
      <span class="title">PRsense</span>
      <div>
        <button class="primary" data-action="review">Review</button>
        <button data-action="close" aria-label="Close">×</button>
      </div>
    </div>
    <div class="body" data-region="body">
      <p class="meta">Click Review to analyze this PR with AI.</p>
    </div>
  `;

  shadow.append(style, root);

  root.querySelector<HTMLButtonElement>('[data-action="review"]')?.addEventListener('click', onReview);
  root.querySelector<HTMLButtonElement>('[data-action="close"]')?.addEventListener('click', () => host.remove());

  const body = root.querySelector<HTMLDivElement>('[data-region="body"]');
  if (!body) throw new Error('Panel body not found');

  return {
    setLoading(message) {
      body.innerHTML = `<p class="meta">${escapeHtml(message)}</p>`;
    },
    setError(message) {
      body.innerHTML = `<p class="err">${escapeHtml(message)}</p>`;
    },
    setReview(review) {
      body.innerHTML = renderReview(review);
    },
    destroy() {
      host.remove();
    },
  };
}

function renderReview(r: Review): string {
  const risks = r.risk_areas
    .map(
      (risk) => `
      <div class="risk ${escapeHtml(risk.severity)}">
        <strong>${escapeHtml(risk.category)} · ${escapeHtml(risk.severity)}</strong>
        <div class="meta">${escapeHtml(risk.file)}${
          risk.line_start ? `:${risk.line_start}` : ''
        }</div>
        <div>${escapeHtml(risk.description)}</div>
        <div class="meta">→ ${escapeHtml(risk.suggestion)}</div>
      </div>`,
    )
    .join('');

  const questions = r.questions_for_author
    .map((q) => `<li>${escapeHtml(q.question)}</li>`)
    .join('');

  return `
    <p>${escapeHtml(r.summary)}</p>
    <div class="meta">Complexity: <strong>${r.complexity_score}/100</strong></div>
    <h4>Risks (${r.risk_areas.length})</h4>
    ${risks || '<p class="meta">None flagged.</p>'}
    ${questions ? `<h4>Questions</h4><ul>${questions}</ul>` : ''}
    <h4>Test coverage</h4>
    <p class="meta">${escapeHtml(r.test_coverage_note)}</p>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
