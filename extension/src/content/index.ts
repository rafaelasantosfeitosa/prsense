import type { Review } from '@prsense/shared';
import {
  fetchPrDiff,
  parsePrContextFromUrl,
  readPrDescriptionFromDom,
  readPrTitleFromDom,
} from './github';
import { mountPanel } from './panel';

interface BackgroundResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
}

async function send<T>(message: unknown): Promise<T> {
  const res = (await chrome.runtime.sendMessage(message)) as BackgroundResponse<T>;
  if (!res.ok) throw new Error(res.error ?? 'Unknown background error');
  return res.result as T;
}

let currentUrl = location.href;

function init() {
  const ctx = parsePrContextFromUrl(location.href);
  if (!ctx) return;

  const panel = mountPanel(async () => {
    panel.setLoading('Authenticating…');
    try {
      let token = await send<string | null>({ type: 'GET_TOKEN' });
      if (!token) {
        token = await send<string>({ type: 'SIGN_IN' });
      }

      panel.setLoading('Fetching diff…');
      const diff = await fetchPrDiff(ctx.owner, ctx.repo, ctx.number, token);

      panel.setLoading('Generating review (Gemini Flash)…');
      const data = await send<{ review: Review }>({
        type: 'REVIEW_PR',
        payload: {
          diff,
          prTitle: readPrTitleFromDom() || `PR #${ctx.number}`,
          prDescription: readPrDescriptionFromDom(),
          repo: `${ctx.owner}/${ctx.repo}`,
        },
      });
      panel.setReview(data.review);
    } catch (err) {
      panel.setError(err instanceof Error ? err.message : 'Review failed');
    }
  });
}

init();

const observer = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    init();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
