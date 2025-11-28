import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../errors/AppError.js';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Validate an Express request target (`body`/`params`/`query`) with a Zod schema.
 * On success the parsed value replaces the original value on `req`.
 */
export const validateRequest = (
  schema: ZodTypeAny,
  options?: { target?: ValidationTarget },
): RequestHandler => {
  const target: ValidationTarget = options?.target ?? 'body';

  return (req, _res, next) => {
    try {
      const valueToValidate = (req as any)[target];
      const parsed = schema.parse(valueToValidate);
      // replace the target with the parsed value for downstream handlers
      (req as any)[target] = parsed;
      return next();
    } catch (err: unknown) {
      return next(new AppError('Invalid request payload', 400, true));
    }
  };
};
