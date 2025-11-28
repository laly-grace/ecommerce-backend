import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { CreateSellerDto, UpdateSellerDto } from '../dtos/seller.dto.js';
import { idParamsSchema } from '../dtos/common.dto.js';
import * as sellerController from '../controllers/sellerController.js';

const router = Router();

router.post(
  '/',
  validateRequest(CreateSellerDto),
  sellerController.createSeller,
);
router.get(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  sellerController.getSeller,
);
router.put(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  validateRequest(UpdateSellerDto),
  sellerController.updateSeller,
);
router.delete(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  sellerController.deleteSeller,
);

export default router;
