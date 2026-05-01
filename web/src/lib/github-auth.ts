interface GitHubUser {
  id: number;
  login: string;
}

const GITHUB_USER_URL = 'https://api.github.com/user';

export async function verifyGitHubToken(token: string): Promise<GitHubUser> {
  const res = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GitHub token verification failed: ${res.status}`);
  }
  const data = (await res.json()) as { id: number; login: string };
  return { id: data.id, login: data.login };
}

export function extractBearer(headerValue: string | null): string | null {
  if (!headerValue) return null;
  const match = headerValue.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}
