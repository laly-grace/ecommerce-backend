import { z } from 'zod';

// ID format: allow cuid-style and general URL-safe id chars (alphanumeric, _ and -)
export const idSchema = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid id format');

export const idParamsSchema = z.object({ id: idSchema });

export const emailSchema = z.string().email();

// Password rules: min 8, at least one upper, one lower, one number and one symbol
export const passwordSchema = z
  .string()
  .min(8)
  .refine(
    (val) => /[a-z]/.test(val),
    'Password must contain a lowercase letter',
  )
  .refine(
    (val) => /[A-Z]/.test(val),
    'Password must contain an uppercase letter',
  )
  .refine((val) => /[0-9]/.test(val), 'Password must contain a number')
  .refine(
    (val) => /[^A-Za-z0-9]/.test(val),
    'Password must contain a special character',
  );

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name must not be empty')
  .max(100, 'Name too long')
  .optional();

export const paginationSchema = z
  .object({
    page: z.preprocess(
      (v) => (typeof v === 'string' ? parseInt(v, 10) : v),
      z.number().int().positive().default(1),
    ),
    limit: z.preprocess(
      (v) => (typeof v === 'string' ? parseInt(v, 10) : v),
      z.number().int().positive().max(100).default(20),
    ),
  })
  .strict();
