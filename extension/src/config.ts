export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000';

export const GITHUB_CLIENT_ID = (import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined) ?? '';

export const STORAGE_KEYS = {
  token: 'gh_token',
} as const;
