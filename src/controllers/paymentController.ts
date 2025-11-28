import type { RequestHandler } from 'express';
import * as paymentService from '../services/paymentService.js';
import { AppError } from '../errors/AppError.js';

export const createPayment: RequestHandler = async (req, res, next) => {
  try {
    const session = res.locals.session;
    if (!session || !session.user || !session.user.id)
      return next(new AppError('Unauthenticated', 401, true));
    const created = await paymentService.createPayment(req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
};

export const getPayment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    const rec = await paymentService.getPaymentById(id);
    if (!rec) return next(new AppError('Not found', 404, true));
    return res.status(200).json({ status: 'success', data: rec });
  } catch (err) {
    return next(err);
  }
};

export const webhook: RequestHandler = async (req, res, next) => {
  try {
    const payload = req.body;
    const updated = await paymentService.handleWebhook(payload);
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return next(err);
  }
};
