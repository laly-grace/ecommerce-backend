import type { RequestHandler } from 'express';
import * as userService from '../services/userService.js';
import { AppError } from '../errors/AppError.js';

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const created = await userService.createUser(req.body);
    return res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    return next(err);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError('Missing id parameter', 400, true));
    }
    const user = await userService.getUserById(id);
    return res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    return next(err);
  }
};
