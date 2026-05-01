import { z } from 'zod';

const EnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().default(''),
  OPENROUTER_MODEL: z.string().default('google/gemini-2.0-flash-001'),
  OPENROUTER_FALLBACK_MODEL: z.string().default('google/gemini-flash-1.5'),
  GITHUB_OAUTH_CLIENT_ID: z.string().optional(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  FREE_TIER_MONTHLY_QUOTA: z.coerce.number().int().positive().default(5),
});

export const env = EnvSchema.parse({
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
  OPENROUTER_FALLBACK_MODEL: process.env.OPENROUTER_FALLBACK_MODEL,
  GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  FREE_TIER_MONTHLY_QUOTA: process.env.FREE_TIER_MONTHLY_QUOTA,
});
