import { env } from '../env';

interface UsageRecord {
  count: number;
  periodKey: string;
}

const usage = new Map<string, UsageRecord>();

function currentPeriodKey(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
  limit: number;
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

export function _resetQuotaForTests(): void {
  usage.clear();
}
