import type { RequestHandler } from 'express';
import * as vendorService from '../services/vendorService.js';
import { AppError } from '../errors/AppError.js';

export const createVendor: RequestHandler = async (req, res, next) => {
  try {
    const created = await vendorService.createVendor(req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
};

export const getVendor: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    const vendor = await vendorService.getVendorById(id);
    return res.status(200).json({ status: 'success', data: vendor });
  } catch (err) {
    return next(err);
  }
};

export const listVendors: RequestHandler = async (_req, res, next) => {
  try {
    const items = await vendorService.listVendors();
    return res.status(200).json({ status: 'success', data: items });
  } catch (err) {
    return next(err);
  }
};

export const updateVendor: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    const updated = await vendorService.updateVendor(id, req.body);
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return next(err);
  }
};

export const deleteVendor: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    await vendorService.deleteVendor(id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
