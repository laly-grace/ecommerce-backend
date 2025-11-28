import type { RequestHandler } from 'express';
import * as cartService from '../services/cartService.js';
import { AppError } from '../errors/AppError.js';

export const createCart: RequestHandler = async (req, res, next) => {
  try {
    const created = await cartService.createCart(req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
};

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    const cart = await cartService.getCartById(id);
    return res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    return next(err);
  }
};

export const addItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // cart id
    if (!id) return next(new AppError('Missing cart id parameter', 400, true));
    const created = await cartService.addItemToCart(id, req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
};

export const updateItem: RequestHandler = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!itemId)
      return next(new AppError('Missing item id parameter', 400, true));
    const updated = await cartService.updateCartItem(itemId, req.body);
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return next(err);
  }
};

export const removeItem: RequestHandler = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!itemId)
      return next(new AppError('Missing item id parameter', 400, true));
    await cartService.removeCartItem(itemId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const deleteCart: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing id parameter', 400, true));
    await cartService.deleteCart(id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
