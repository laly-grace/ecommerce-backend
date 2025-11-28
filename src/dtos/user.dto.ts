import { z } from 'zod';
import { emailSchema, passwordSchema, nameSchema } from './common.dto.js';

export const CreateUserDto = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
  })
  .strict();

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = z
  .object({
    email: emailSchema.optional(),
    name: nameSchema.optional(),
    role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
    password: passwordSchema.optional(),
  })
  .strict();

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;

export const ListUsersQuery = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
    q: z.string().optional(),
  })
  .strict();

export type ListUsersQueryType = z.infer<typeof ListUsersQuery>;
