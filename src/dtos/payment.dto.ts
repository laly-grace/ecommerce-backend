import { z } from 'zod';
import { idSchema } from './common.dto.js';

export const PaymentMethodEnum = z.enum([
  'CARD',
  'WALLET',
  'COD',
  'BANK_TRANSFER',
]);
export const PaymentStatusEnum = z.enum([
  'PENDING',
  'AUTHORIZED',
  'PAID',
  'FAILED',
  'REFUNDED',
]);

export const CreatePaymentDto = z
  .object({
    orderId: idSchema,
    method: PaymentMethodEnum,
    amountCents: z.number().int().nonnegative(),
    currency: z.string().optional(),
    gateway: z.string().optional(),
    transactionRef: z.string().optional(),
  })
  .strict();

export type CreatePaymentDtoType = z.infer<typeof CreatePaymentDto>;

export const UpdatePaymentDto = z
  .object({
    status: PaymentStatusEnum.optional(),
    transactionRef: z.string().optional(),
    errorMessage: z.string().optional(),
    capturedAt: z.string().datetime().optional(),
  })
  .strict();

export type UpdatePaymentDtoType = z.infer<typeof UpdatePaymentDto>;

export const WebhookPaymentDto = z
  .object({
    orderId: idSchema,
    transactionRef: z.string().optional(),
    status: PaymentStatusEnum,
    gateway: z.string().optional(),
    amountCents: z.number().int().optional(),
  })
  .strict();

export type WebhookPaymentDtoType = z.infer<typeof WebhookPaymentDto>;
