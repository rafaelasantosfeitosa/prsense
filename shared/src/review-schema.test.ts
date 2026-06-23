import { describe, expect, it } from 'vitest';
import { ReviewSchema } from './review-schema';

describe('ReviewSchema', () => {
  it('parses valid review', () => {
    const valid = {
      summary: 'Adds login flow',
      complexity_score: 42,
      risk_areas: [
        {
          file: 'src/auth.ts',
          line_start: 10,
          line_end: 12,
          severity: 'high',
          category: 'security',
          description: 'Token check uses < instead of <=',
          suggestion: 'Change comparison operator',
        },
      ],
      questions_for_author: [{ question: 'Is rate limiting needed?', context: 'Public endpoint' }],
      test_coverage_note: 'No tests added for auth path',
    };
    expect(() => ReviewSchema.parse(valid)).not.toThrow();
  });

  it('rejects out-of-range complexity', () => {
    const invalid = {
      summary: 'x',
      complexity_score: 150,
      risk_areas: [],
      questions_for_author: [],
      test_coverage_note: '',
    };
    expect(() => ReviewSchema.parse(invalid)).toThrow();
  });

  it('rejects unknown severity', () => {
    const invalid = {
      summary: 'x',
      complexity_score: 10,
      risk_areas: [
        {
          file: 'a.ts',
          line_start: null,
          line_end: null,
          severity: 'nuclear',
          category: 'security',
          description: 'd',
          suggestion: 's',
        },
      ],
      questions_for_author: [],
      test_coverage_note: '',
    };
    expect(() => ReviewSchema.parse(invalid)).toThrow();
  });
});
