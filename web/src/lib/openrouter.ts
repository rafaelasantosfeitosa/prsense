import { ReviewSchema, openRouterResponseFormat } from '@prsense/shared';
import type { Review } from '@prsense/shared';
import { env } from '../env';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are a senior staff engineer performing a careful pull request review.
Be concrete, cite file names and line numbers when possible, and prioritize correctness, security, and maintainability.
Output ONLY JSON matching the provided schema. Do not include markdown fences or commentary.`;

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

interface ReviewInput {
  diff: string;
  prTitle: string;
  prDescription: string;
  repo: string;
}

export async function generateReview(input: ReviewInput): Promise<Review> {
  const userMessage = buildUserMessage(input);

  const review = await callModel(env.OPENROUTER_MODEL, userMessage).catch(async (err) => {
    if (err instanceof OpenRouterError && err.status >= 500) {
      return callModel(env.OPENROUTER_FALLBACK_MODEL, userMessage);
    }
    throw err;
  });

  return review;
}

async function callModel(model: string, userMessage: string): Promise<Review> {
  if (!env.OPENROUTER_API_KEY) {
    throw new OpenRouterError('OPENROUTER_API_KEY not configured', 500, '');
  }
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': env.NEXT_PUBLIC_APP_URL,
      'X-Title': 'PRsense',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: openRouterResponseFormat,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new OpenRouterError(`OpenRouter ${res.status}`, res.status, body);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new OpenRouterError('Empty completion', 502, JSON.stringify(json));
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new OpenRouterError('Model returned non-JSON', 502, content);
  }
  return ReviewSchema.parse(parsed);
}

function buildUserMessage({ diff, prTitle, prDescription, repo }: ReviewInput): string {
  const truncatedDiff =
    diff.length > 60_000 ? `${diff.slice(0, 60_000)}\n\n[diff truncated]` : diff;
  return [
    `Repository: ${repo}`,
    `PR title: ${prTitle}`,
    'PR description:',
    prDescription || '(no description)',
    '',
    'Unified diff:',
    '```diff',
    truncatedDiff,
    '```',
  ].join('\n');
}
