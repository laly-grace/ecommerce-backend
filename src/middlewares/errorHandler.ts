import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';

function extractPrismaDetails(err: any) {
  // Common Prisma error shapes include `code`, `meta` and `clientVersion`.
  if (!err || typeof err !== 'object') return undefined;
  const details: Record<string, unknown> = {};
  if ('code' in err) details.code = (err as any).code;
  if ('meta' in err) details.meta = (err as any).meta;
  if ('clientVersion' in err)
    details.clientVersion = (err as any).clientVersion;
  return Object.keys(details).length ? details : undefined;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const correlationId = res.locals.correlationId;
  const log = res.locals.logger || logger;

  // Operational errors created by AppError
  if (err instanceof AppError) {
    log.error({ err, correlationId }, 'Operational error');
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      correlationId,
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    });
  }

  // Non-AppError: try to include helpful debug information in development
  const dev = process.env.NODE_ENV !== 'production';
  // Pull Prisma details if present to help debugging
  const prismaDetails = extractPrismaDetails(err as any);

  if (dev) {
    log.fatal({ err, correlationId, prismaDetails }, 'Unhandled error (dev)');
    const payload: any = {
      status: 'error',
      message: (err as any)?.message ?? 'Internal Server Error',
      correlationId,
    };
    if (prismaDetails) payload.prisma = prismaDetails;
    if (err instanceof Error && err.stack) payload.stack = err.stack;
    return res.status(500).json(payload);
  }

  // Production: avoid leaking internals but still log
  log.fatal({ err, correlationId }, 'Unhandled error');
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    correlationId,
  });
}
