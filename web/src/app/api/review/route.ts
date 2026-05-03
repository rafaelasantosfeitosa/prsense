import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractBearer, verifyGitHubToken } from '../../../lib/github-auth';
import { OpenRouterError, generateReview } from '../../../lib/openrouter';
import { checkAndIncrementQuota } from '../../../lib/quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  diff: z.string().min(1).max(500_000),
  prTitle: z.string().min(1).max(500),
  prDescription: z.string().max(20_000).default(''),
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Expected owner/repo'),
});

export async function POST(req: NextRequest) {
  const token = extractBearer(req.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  let user: { id: number; login: string };
  try {
    user = await verifyGitHubToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid GitHub token' }, { status: 401 });
  }

  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request body', details: (err as z.ZodError).issues },
      { status: 400 },
    );
  }

  const quotaKey = `gh:${user.id}`;
  const quota = checkAndIncrementQuota(quotaKey);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: 'Monthly quota exceeded', limit: quota.limit },
      { status: 429 },
    );
  }

  try {
    const review = await generateReview(body);
    return NextResponse.json(
      { review, quota: { remaining: quota.remaining, limit: quota.limit } },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof OpenRouterError) {
      return NextResponse.json(
        { error: 'Upstream model error', detail: err.message },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
