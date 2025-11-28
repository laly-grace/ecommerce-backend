import { z } from 'zod';
import { idSchema } from './common.dto.js';

export const CreateVendorDto = z
  .object({
    sellerId: idSchema,
    name: z.string().min(1).max(200),
    slug: z.string().trim().min(1).optional(),
    description: z.string().max(2000).optional(),
    logoUrl: z.string().url().optional(),
  })
  .strict();

export const UpdateVendorDto = CreateVendorDto.partial().strict();

export type CreateVendorDtoType = z.infer<typeof CreateVendorDto>;
export type UpdateVendorDtoType = z.infer<typeof UpdateVendorDto>;
