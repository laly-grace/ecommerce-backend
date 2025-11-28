import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../errors/AppError.js';

export const validateRequest = (schema: ZodTypeAny): RequestHandler => {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req.body);
      // replace body with parsed value for downstream handlers
      req.body = parsed;
      return next();
    } catch (err: unknown) {
      return next(new AppError('Invalid request payload', 400, true));
    }
  };
};
