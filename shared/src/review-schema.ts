import { z } from 'zod';

export const RiskAreaSchema = z.object({
  file: z.string().min(1).describe('Path of the file with the risk'),
  line_start: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .describe('Starting line, null if file-level'),
  line_end: z.number().int().nonnegative().nullable().describe('Ending line, null if file-level'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum([
    'security',
    'performance',
    'correctness',
    'maintainability',
    'style',
    'testing',
    'documentation',
  ]),
  description: z.string().min(1).describe('What the risk is and why it matters'),
  suggestion: z.string().min(1).describe('How to mitigate or fix'),
});

export const QuestionSchema = z.object({
  question: z.string().min(1),
  context: z.string().describe('Why this question matters for the reviewer/author'),
});

export const ReviewSchema = z.object({
  summary: z.string().min(1).describe('One-paragraph high-level summary of the PR'),
  complexity_score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Estimated review complexity. 0=trivial, 100=very complex'),
  risk_areas: z.array(RiskAreaSchema).describe('Concrete risks found in the diff'),
  questions_for_author: z
    .array(QuestionSchema)
    .describe('Clarifying questions a reviewer should ask'),
  test_coverage_note: z
    .string()
    .describe('Assessment of whether tests cover the changes adequately'),
});

export type RiskArea = z.infer<typeof RiskAreaSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Review = z.infer<typeof ReviewSchema>;

export const REVIEW_SCHEMA_VERSION = '1.0.0' as const;
