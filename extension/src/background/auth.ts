import { API_BASE_URL, GITHUB_CLIENT_ID, STORAGE_KEYS } from '../config';
import { challengeFromVerifier, randomVerifier } from './pkce';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const SCOPES = 'read:user repo';

export async function signIn(): Promise<string> {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('VITE_GITHUB_CLIENT_ID not configured');
  }

  const verifier = randomVerifier();
  const challenge = await challengeFromVerifier(verifier);
  const state = randomVerifier(16);
  const redirectUri = chrome.identity.getRedirectURL('github');

  const url = new URL(GITHUB_AUTHORIZE_URL);
  url.searchParams.set('client_id', GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', SCOPES);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: url.toString(),
    interactive: true,
  });
  if (!responseUrl) throw new Error('OAuth flow returned no URL');

  const callback = new URL(responseUrl);
  const returnedState = callback.searchParams.get('state');
  const code = callback.searchParams.get('code');
  if (returnedState !== state) throw new Error('State mismatch — possible CSRF');
  if (!code) throw new Error('No code in OAuth callback');

  const token = await exchangeCode(code, verifier);
  await chrome.storage.local.set({ [STORAGE_KEYS.token]: token });
  return token;
}

async function exchangeCode(code: string, verifier: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/github/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, code_verifier: verifier }),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No access_token in exchange response');
  return data.access_token;
}

export async function getStoredToken(): Promise<string | null> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.token);
  return (result[STORAGE_KEYS.token] as string | undefined) ?? null;
}

export async function signOut(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEYS.token);
}
