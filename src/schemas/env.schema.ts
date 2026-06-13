import { z } from 'zod';

// Check if DEMO_MODE is enabled
const isDemoMode = process.env.DEMO_MODE === 'true';

export const EnvSchema = z.object({
  // API keys are optional in demo mode, required otherwise
  OPENAI_API_KEY: isDemoMode 
    ? z.string().optional().default('demo-key')
    : z.string().min(1, 'OPENAI_API_KEY is required'),
  BRAVE_API_KEY: isDemoMode
    ? z.string().optional().default('demo-key')
    : z.string().min(1, 'BRAVE_API_KEY is required'),
  
  // Database URL - use SQLite in demo mode
  DATABASE_URL: isDemoMode
    ? z.string().default('file:./demo.db')
    : z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  
  // Email settings are optional in demo mode
  RESEND_API_KEY: isDemoMode
    ? z.string().optional().default('demo-key')
    : z.string().min(1, 'RESEND_API_KEY is required'),
  REPORT_RECIPIENT_EMAIL: isDemoMode
    ? z.string().optional().default('demo@example.com')
    : z.string().email('REPORT_RECIPIENT_EMAIL must be a valid email'),
  
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Demo mode flag
  DEMO_MODE: z.string().transform(val => val === 'true').default('false')
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;
