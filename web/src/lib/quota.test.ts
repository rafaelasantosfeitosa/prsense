import { beforeEach, describe, expect, it } from 'vitest';
import { _resetQuotaForTests, checkAndIncrementQuota } from './quota';

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
