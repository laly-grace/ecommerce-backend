import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { CreateVendorDto, UpdateVendorDto } from '../dtos/vendor.dto.js';
import { idParamsSchema } from '../dtos/common.dto.js';
import * as vendorController from '../controllers/vendorController.js';

const router = Router();

router.post(
  '/',
  validateRequest(CreateVendorDto),
  vendorController.createVendor,
);
router.get('/', vendorController.listVendors);
router.get(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  vendorController.getVendor,
);
router.put(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  validateRequest(UpdateVendorDto),
  vendorController.updateVendor,
);
router.delete(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  vendorController.deleteVendor,
);

export default router;
