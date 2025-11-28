import { z } from 'zod';
import { idSchema } from './common.dto.js';

export const CreateCartDto = z
  .object({
    userId: idSchema.optional(),
    sessionId: z.string().optional(),
  })
  .strict();

export type CreateCartDtoType = z.infer<typeof CreateCartDto>;

export const AddCartItemDto = z
  .object({
    productId: idSchema,
    title: z.string().min(1),
    unitPriceCents: z.number().int().nonnegative(),
    quantity: z.number().int().positive(),
    image: z.string().url().optional(),
    variantSku: z.string().optional(),
  })
  .strict();

export type AddCartItemDtoType = z.infer<typeof AddCartItemDto>;

export const UpdateCartItemDto = z
  .object({
    quantity: z.number().int().nonnegative(),
  })
  .strict();

export type UpdateCartItemDtoType = z.infer<typeof UpdateCartItemDto>;
