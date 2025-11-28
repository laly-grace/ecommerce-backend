import { prisma } from '../db/prisma.js';
import type { CreateUserDtoType } from '../dtos/user.dto.js';

export const createUser = async (
  data: CreateUserDtoType & { passwordHash: string },
) => {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name ?? null,
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

export const findUsers = async (opts: {
  page: number;
  limit: number;
  role?: string;
  q?: string;
}) => {
  const where: any = {};
  if (opts.role) where.role = opts.role;
  if (opts.q) {
    where.OR = [
      { email: { contains: opts.q } },
      { name: { contains: opts.q } },
    ];
  }

  const skip = (opts.page - 1) * opts.limit;
  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      take: opts.limit,
      skip,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { total, items };
};

export const updateUser = async (
  id: string,
  data: Partial<{
    email: string;
    name?: string | null;
    role?: string;
    passwordHash?: string;
  }>,
) => {
  const prismaData: any = {};
  if (data.email !== undefined) prismaData.email = data.email;
  if (data.name !== undefined) prismaData.name = data.name ?? null;
  if (data.role !== undefined) prismaData.role = data.role;
  if (data.passwordHash !== undefined)
    prismaData.passwordHash = data.passwordHash;
  return prisma.user.update({ where: { id }, data: prismaData });
};

export const deleteUser = async (id: string) =>
  prisma.user.delete({ where: { id } });
