export interface PrContext {
  owner: string;
  repo: string;
  number: number;
  title: string;
  description: string;
}

export function parsePrContextFromUrl(
  url: string,
): Omit<PrContext, 'title' | 'description'> | null {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2];
  const numStr = match[3];
  if (!owner || !repo || !numStr) return null;
  return { owner, repo, number: Number.parseInt(numStr, 10) };
}

export async function fetchPrDiff(
  owner: string,
  repo: string,
  number: number,
  token: string,
): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.diff',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) throw new Error(`GitHub diff fetch failed: ${res.status}`);
  return res.text();
}

export function readPrTitleFromDom(): string {
  const el = document.querySelector<HTMLElement>('.js-issue-title, bdi.js-issue-title');
  return el?.textContent?.trim() ?? '';
}

export function readPrDescriptionFromDom(): string {
  const el = document.querySelector<HTMLElement>('.comment-body');
  return el?.textContent?.trim() ?? '';
}
