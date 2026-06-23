import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '../../../../../env';
import {
  clientIp,
  contentLengthExceeds,
  hasJsonContentType,
  noStoreJson,
} from '../../../../../lib/api-response';
import { checkAndIncrementRateLimit } from '../../../../../lib/quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  code: z.string().min(1).max(2_048),
  code_verifier: z.string().min(43).max(128),
});

export async function POST(req: NextRequest) {
  if (contentLengthExceeds(req, env.AUTH_EXCHANGE_MAX_BODY_BYTES)) {
    return noStoreJson({ error: 'Request body too large' }, 413);
  }

  if (!hasJsonContentType(req)) {
    return noStoreJson({ error: 'Content-Type must be application/json' }, 415);
  }

  const ipLimit = checkAndIncrementRateLimit(`oauth:${clientIp(req)}`);
  if (!ipLimit.allowed) {
    return noStoreJson(
      { error: 'Too many OAuth exchange requests', resetAt: ipLimit.resetAt },
      429,
    );
  }

  if (!env.GITHUB_OAUTH_CLIENT_ID || !env.GITHUB_OAUTH_CLIENT_SECRET) {
    return noStoreJson({ error: 'GitHub OAuth not configured' }, 503);
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return noStoreJson({ error: 'Invalid body' }, 400);
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
      code: body.code,
      code_verifier: body.code_verifier,
    }),
  });

  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    return noStoreJson({ error: 'Exchange failed' }, 400);
  }
  return noStoreJson({ access_token: data.access_token }, 200);
}
