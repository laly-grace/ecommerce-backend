import { z } from 'zod';
import { idSchema } from './common.dto.js';

export const CreateSellerDto = z
  .object({
    userId: idSchema,
    displayName: z.string().trim().min(1).max(100),
    slug: z.string().trim().min(1).optional(),
    about: z.string().max(2000).optional(),
  })
  .strict();

export const UpdateSellerDto = CreateSellerDto.partial().strict();

export type CreateSellerDtoType = z.infer<typeof CreateSellerDto>;
export type UpdateSellerDtoType = z.infer<typeof UpdateSellerDto>;
