import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { randomUUID } from 'crypto';

// Attaches a correlationId and per-request child logger to res.locals
export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const correlationId = randomUUID();
  res.locals.correlationId = correlationId;
  res.locals.logger = logger.child({
    correlationId,
    path: req.path,
    method: req.method,
  });
  next();
}
