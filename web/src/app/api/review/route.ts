import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '../../../env';
import {
  clientIp,
  contentLengthExceeds,
  hasJsonContentType,
  noStoreJson,
} from '../../../lib/api-response';
import { extractBearer, isAllowedGitHubLogin, verifyGitHubToken } from '../../../lib/github-auth';
import { OpenRouterError, generateReview } from '../../../lib/openrouter';
import { checkAndIncrementQuota, checkAndIncrementRateLimit } from '../../../lib/quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  diff: z.string().min(1).max(env.REVIEW_MAX_DIFF_CHARS),
  prTitle: z.string().min(1).max(500),
  prDescription: z.string().max(10_000).default(''),
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Expected owner/repo'),
});

export async function POST(req: NextRequest) {
  if (contentLengthExceeds(req, env.REVIEW_MAX_BODY_BYTES)) {
    return noStoreJson({ error: 'Request body too large' }, 413);
  }

  if (!hasJsonContentType(req)) {
    return noStoreJson({ error: 'Content-Type must be application/json' }, 415);
  }

  const ipLimit = checkAndIncrementRateLimit(`ip:${clientIp(req)}`);
  if (!ipLimit.allowed) {
    return noStoreJson(
      { error: 'Too many review requests', limit: ipLimit.limit, resetAt: ipLimit.resetAt },
      429,
    );
  }

  const token = extractBearer(req.headers.get('authorization'));
  if (!token) {
    return noStoreJson({ error: 'Missing bearer token' }, 401);
  }

  let user: { id: number; login: string };
  try {
    user = await verifyGitHubToken(token);
  } catch {
    return noStoreJson({ error: 'Invalid GitHub token' }, 401);
  }

  if (!isAllowedGitHubLogin(user.login)) {
    return noStoreJson({ error: 'PRsense review API is in private beta' }, 403);
  }

  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await req.json());
  } catch (err) {
    const details = err instanceof z.ZodError ? err.issues : undefined;
    return noStoreJson({ error: 'Invalid request body', details }, 400);
  }

  const quotaKey = `gh:${user.id}`;
  const quota = checkAndIncrementQuota(quotaKey);
  if (!quota.allowed) {
    return noStoreJson({ error: 'Monthly quota exceeded', limit: quota.limit }, 429);
  }

  try {
    const review = await generateReview(body);
    return noStoreJson({ review, quota: { remaining: quota.remaining, limit: quota.limit } }, 200);
  } catch (err) {
    if (err instanceof OpenRouterError) {
      return noStoreJson({ error: 'AI review service unavailable' }, 502);
    }
    return noStoreJson({ error: 'Internal error' }, 500);
  }
}
