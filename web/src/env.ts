import { z } from 'zod';

if (typeof window !== 'undefined') {
  throw new Error('web/src/env.ts must only be imported by server-side code');
}

const EnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().default(''),
  OPENROUTER_MODEL: z.string().default('google/gemini-2.0-flash-001'),
  OPENROUTER_FALLBACK_MODEL: z.string().default('google/gemini-flash-1.5'),
  GITHUB_OAUTH_CLIENT_ID: z.string().optional(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  FREE_TIER_MONTHLY_QUOTA: z.coerce.number().int().positive().default(5),
  REVIEW_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(3),
  REVIEW_MAX_BODY_BYTES: z.coerce.number().int().positive().default(250_000),
  REVIEW_MAX_DIFF_CHARS: z.coerce.number().int().positive().default(80_000),
  AUTH_EXCHANGE_MAX_BODY_BYTES: z.coerce.number().int().positive().default(10_000),
  GITHUB_LOGIN_ALLOWLIST: z.string().default(''),
});

export const env = EnvSchema.parse({
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
  OPENROUTER_FALLBACK_MODEL: process.env.OPENROUTER_FALLBACK_MODEL,
  GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  FREE_TIER_MONTHLY_QUOTA: process.env.FREE_TIER_MONTHLY_QUOTA,
  REVIEW_RATE_LIMIT_PER_MINUTE: process.env.REVIEW_RATE_LIMIT_PER_MINUTE,
  REVIEW_MAX_BODY_BYTES: process.env.REVIEW_MAX_BODY_BYTES,
  REVIEW_MAX_DIFF_CHARS: process.env.REVIEW_MAX_DIFF_CHARS,
  AUTH_EXCHANGE_MAX_BODY_BYTES: process.env.AUTH_EXCHANGE_MAX_BODY_BYTES,
  GITHUB_LOGIN_ALLOWLIST: process.env.GITHUB_LOGIN_ALLOWLIST,
});
