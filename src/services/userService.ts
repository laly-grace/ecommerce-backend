import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';
import * as userRepo from '../repositories/userRepository.js';
import type { CreateUserDtoType } from '../dtos/user.dto.js';

export const createUser = async (data: CreateUserDtoType) => {
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new AppError('Email already in use', 409);

  const passwordHash = await bcrypt.hash(data.password, 10);
  const created = await userRepo.createUser({ ...data, passwordHash });

  // do not return passwordHash
  // Prisma returns many fields; strip sensitive before returning
  // ts-ignore so we can delete the field safely at runtime
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete created.passwordHash;
  return created;
};

export const getUserById = async (id: string) => {
  const u = await userRepo.findUserById(id);
  if (!u) throw new AppError('User not found', 404);
  // @ts-ignore
  delete u.passwordHash;
  return u;
};

export const listUsers = async (opts: {
  page?: number;
  limit?: number;
  role?: string;
  q?: string;
}) => {
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 20;
  const repoArgs: any = { page, limit };
  if (opts.role !== undefined) repoArgs.role = opts.role;
  if (opts.q !== undefined) repoArgs.q = opts.q;
  return userRepo.findUsers(repoArgs);
};

export const updateUser = async (id: string, data: any) => {
  // If updating password, hash it
  const toUpdate: any = { ...data };
  if (toUpdate.password) {
    const hash = await bcrypt.hash(toUpdate.password, 10);
    toUpdate.passwordHash = hash;
    delete toUpdate.password;
  }
  const updated = await userRepo.updateUser(id, toUpdate);
  // @ts-ignore
  delete updated.passwordHash;
  return updated;
};

export const deleteUser = async (id: string) => {
  await userRepo.deleteUser(id);
};
