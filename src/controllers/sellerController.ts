import type { RequestHandler } from 'express';
import * as sellerService from '../services/sellerService.js';
import { AppError } from '../errors/AppError.js';

export const createSeller: RequestHandler = async (req, res, next) => {
  try {
    const created = await sellerService.createSellerProfile(req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
};

export const getSeller: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    const seller = await sellerService.getSellerById(id);
    return res.status(200).json({ status: 'success', data: seller });
  } catch (err) {
    return next(err);
  }
};

export const updateSeller: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    const updated = await sellerService.updateSellerProfile(id, req.body);
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return next(err);
  }
};

export const deleteSeller: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    await sellerService.deleteSellerProfile(id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
