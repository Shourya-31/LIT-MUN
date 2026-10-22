import { z } from 'zod';
import { resolve } from 'node:path';

const booleanFromString = z.preprocess(
  (value) => (typeof value === 'string' ? value.toLowerCase() === 'true' : value),
  z.boolean(),
);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(9090),
  DATABASE_URL: z.string().min(1),
  FRONTEND_ORIGINS: z.string().default('http://localhost:9090,http://localhost:5173'),
  STATIC_DIR: z.string().default('../frontend/dist'),
  JWT_ACCESS_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().min(1).max(90).default(14),
  COOKIE_SECURE: booleanFromString.default(false),
  APP_BASE_URL: z.string().url().default('http://localhost:9090'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_SECURE: booleanFromString.default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues.map(({ path, message }) => `${path.join('.')}: ${message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${issues}`);
}

const parsed = result.data;
const smtpValues = [parsed.SMTP_HOST, parsed.SMTP_USER, parsed.SMTP_PASSWORD, parsed.EMAIL_FROM];
const smtpProvidedCount = smtpValues.filter(Boolean).length;

if (smtpProvidedCount > 0 && smtpProvidedCount !== smtpValues.length) {
  throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and EMAIL_FROM must be configured together.');
}

if (parsed.NODE_ENV === 'production' && !parsed.COOKIE_SECURE) {
  throw new Error('COOKIE_SECURE must be true in production.');
}

export const env = {
  ...parsed,
  STATIC_DIR: resolve(process.cwd(), parsed.STATIC_DIR),
  FRONTEND_ORIGINS: parsed.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
  SMTP_CONFIGURED: smtpProvidedCount === smtpValues.length,
};

export type Environment = typeof env;
