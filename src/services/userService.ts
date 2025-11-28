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
