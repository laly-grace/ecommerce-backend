import type { RequestHandler } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../utils/auth.js';
import { AppError } from '../errors/AppError.js';

// Attach authenticated session and user to res.locals
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session || !session.user || !session.user.id) {
      return next(new AppError('Unauthenticated', 401, true));
    }
    res.locals.session = session;
    res.locals.user = session.user;
    return next();
  } catch (err) {
    return next(err);
  }
};
