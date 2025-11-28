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
