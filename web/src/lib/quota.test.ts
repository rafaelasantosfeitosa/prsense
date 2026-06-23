import { beforeEach, describe, expect, it } from 'vitest';
import { _resetQuotaForTests, checkAndIncrementQuota, checkAndIncrementRateLimit } from './quota';

describe('checkAndIncrementQuota', () => {
  beforeEach(() => {
    _resetQuotaForTests();
  });

  it('allows up to limit then blocks', () => {
    const key = 'gh:1';
    const limit = 5;
    for (let i = 0; i < limit; i++) {
      const r = checkAndIncrementQuota(key);
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(limit - 1 - i);
    }
    const blocked = checkAndIncrementQuota(key);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('isolates per-user counters', () => {
    expect(checkAndIncrementQuota('gh:1').allowed).toBe(true);
    expect(checkAndIncrementQuota('gh:2').allowed).toBe(true);
  });
});

describe('checkAndIncrementRateLimit', () => {
  beforeEach(() => {
    _resetQuotaForTests();
  });

  it('blocks after the per-minute limit and resets in the next window', () => {
    const now = Date.UTC(2026, 5, 23, 12, 0, 0);
    expect(checkAndIncrementRateLimit('ip:1', now).allowed).toBe(true);
    expect(checkAndIncrementRateLimit('ip:1', now + 1).allowed).toBe(true);
    expect(checkAndIncrementRateLimit('ip:1', now + 2).allowed).toBe(true);

    const blocked = checkAndIncrementRateLimit('ip:1', now + 3);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);

    const reset = checkAndIncrementRateLimit('ip:1', now + 60_001);
    expect(reset.allowed).toBe(true);
    expect(reset.remaining).toBe(2);
  });
});
