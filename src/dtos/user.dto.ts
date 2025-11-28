import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
