import { config } from 'dotenv';
import { EnvSchema, type EnvSchemaType } from '../schemas/env.schema.js';
import { ConfigurationError } from '../shared/errors.js';
import { logger } from '../shared/logger.js';

config();

let envConfig: EnvSchemaType;

try {
  envConfig = EnvSchema.parse(process.env);
  logger.info('Environment configuration loaded successfully');
} catch (error) {
  logger.error('Failed to load environment configuration', error);
  throw new ConfigurationError('Invalid environment configuration. Check .env file.');
}

export const env = envConfig;
