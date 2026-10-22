import { z } from 'zod';

const emailSchema = z.string().trim().email().max(320).transform((email) => email.toLowerCase());

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: emailSchema,
  phone: z.string().trim().min(5).max(40),
  institution: z.string().trim().min(2).max(200),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const emailSchemaBody = z.object({ email: emailSchema });
export const tokenSchema = z.object({ token: z.string().min(32).max(256) });
export const resetPasswordSchema = tokenSchema.extend({
  password: z.string().min(8).max(128),
});
