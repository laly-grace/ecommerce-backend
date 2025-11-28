import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  CreateOrderDto,
  ListOrdersQuery,
  UpdateOrderDto,
} from '../dtos/order.dto.js';
import * as orderController from '../controllers/orderController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireOrderOwner } from '../middlewares/requireOrderOwner.js';

const router = Router();

// Creation requires authentication
router.post(
  '/',
  requireAuth,
  validateRequest(CreateOrderDto),
  orderController.createOrder,
);

// Listing requires authentication (admins or customers with filter)
router.get(
  '/',
  requireAuth,
  validateRequest(ListOrdersQuery, { target: 'query' }),
  orderController.listOrders,
);

// Individual actions require ownership or admin
router.get('/:id', requireAuth, requireOrderOwner, orderController.getOrder);
router.put(
  '/:id',
  requireAuth,
  requireOrderOwner,
  validateRequest(UpdateOrderDto),
  orderController.updateOrder,
);
router.delete(
  '/:id',
  requireAuth,
  requireOrderOwner,
  orderController.deleteOrder,
);

export default router;
