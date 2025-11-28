import type { RequestHandler } from 'express';
import * as orderService from '../services/orderService.js';
import { AppError } from '../errors/AppError.js';

// Ensure the authenticated user owns the order or is an ADMIN
export const requireOrderOwner: RequestHandler = async (req, res, next) => {
  try {
    const session = res.locals.session;
    if (!session || !session.user || !session.user.id) {
      return next(new AppError('Unauthenticated', 401, true));
    }

    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));

    const order = await orderService.getOrderById(id);
    if (!order) return next(new AppError('Order not found', 404, true));

    const userId = session.user.id as string;
    const role = (session.user as any)?.role as string | undefined;

    if (role === 'ADMIN' || order.customerId === userId) {
      res.locals.order = order;
      return next();
    }

    return next(new AppError('Forbidden', 403, true));
  } catch (err) {
    return next(err);
  }
};
