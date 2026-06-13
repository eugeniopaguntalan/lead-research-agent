import { z } from 'zod';

export const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  BRAVE_API_KEY: z.string().min(1, 'BRAVE_API_KEY is required'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  REPORT_RECIPIENT_EMAIL: z.string().email('REPORT_RECIPIENT_EMAIL must be a valid email'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;
