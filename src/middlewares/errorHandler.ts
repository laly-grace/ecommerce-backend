import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Default to 500 for unknown errors
  const correlationId = res.locals.correlationId;
  const log = res.locals.logger || logger;

  if (err instanceof AppError) {
    log.error({ err, correlationId }, 'Operational error');
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      correlationId,
      // expose only when not production
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    });
  }

  // Unexpected errors
  log.fatal({ err, correlationId }, 'Unhandled error');
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    correlationId,
  });
}
