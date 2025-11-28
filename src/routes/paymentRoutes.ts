import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { CreatePaymentDto, WebhookPaymentDto } from '../dtos/payment.dto.js';
import * as paymentController from '../controllers/paymentController.js';

const router = Router();

router.post(
  '/',
  validateRequest(CreatePaymentDto),
  requireAuth,
  paymentController.createPayment,
);
// webhook endpoint (public) - in real system verify signature
router.post(
  '/webhook',
  validateRequest(WebhookPaymentDto),
  paymentController.webhook,
);
router.get('/:id', requireAuth, paymentController.getPayment);

export default router;
