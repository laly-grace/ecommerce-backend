import { prisma } from '../db/prisma.js';
import type { CreateUserDtoType } from '../dtos/user.dto.js';

export const createUser = async (
  data: CreateUserDtoType & { passwordHash: string },
) => {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role ?? 'CUSTOMER',
    },
  });
  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
