import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  CreateCartDto,
  AddCartItemDto,
  UpdateCartItemDto,
} from '../dtos/cart.dto.js';
import * as cartController from '../controllers/cartController.js';

const router = Router();

router.post('/', validateRequest(CreateCartDto), cartController.createCart);
router.get('/:id', cartController.getCart);
router.post(
  '/:id/items',
  validateRequest(AddCartItemDto),
  cartController.addItem,
);
router.put(
  '/:id/items/:itemId',
  validateRequest(UpdateCartItemDto),
  cartController.updateItem,
);
router.delete('/:id/items/:itemId', cartController.removeItem);
router.delete('/:id', cartController.deleteCart);

export default router;
