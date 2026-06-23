import { env } from '../env';

interface UsageRecord {
  count: number;
  periodKey: string;
}

interface RateRecord {
  count: number;
  resetAt: number;
}

const usage = new Map<string, UsageRecord>();
const rateUsage = new Map<string, RateRecord>();

function currentPeriodKey(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export interface RateLimitResult extends QuotaResult {
  resetAt: number;
}

export function checkAndIncrementQuota(userKey: string): QuotaResult {
  const period = currentPeriodKey();
  const limit = env.FREE_TIER_MONTHLY_QUOTA;
  const existing = usage.get(userKey);

  const record: UsageRecord =
    existing && existing.periodKey === period ? existing : { count: 0, periodKey: period };

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  record.count += 1;
  usage.set(userKey, record);
  return { allowed: true, remaining: Math.max(0, limit - record.count), limit };
}

export function checkAndIncrementRateLimit(key: string, now = Date.now()): RateLimitResult {
  const limit = env.REVIEW_RATE_LIMIT_PER_MINUTE;
  const windowMs = 60_000;
  const existing = rateUsage.get(key);
  const record: RateRecord =
    existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs };

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, limit, resetAt: record.resetAt };
  }

  record.count += 1;
  rateUsage.set(key, record);
  return {
    allowed: true,
    remaining: Math.max(0, limit - record.count),
    limit,
    resetAt: record.resetAt,
  };
}

export function _resetQuotaForTests(): void {
  usage.clear();
  rateUsage.clear();
}
