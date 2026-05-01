import { zodToJsonSchema } from 'zod-to-json-schema';
import { ReviewSchema } from './review-schema';

export * from './review-schema';

export const reviewJsonSchema = zodToJsonSchema(ReviewSchema, {
  name: 'Review',
  target: 'openApi3',
  $refStrategy: 'none',
});

export const openRouterResponseFormat = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'Review',
    strict: true,
    schema: zodToJsonSchema(ReviewSchema, {
      target: 'openApi3',
      $refStrategy: 'none',
    }),
  },
};
