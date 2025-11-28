import { prisma } from '../db/prisma.js';
import type {
  CreateSellerDtoType,
  UpdateSellerDtoType,
} from '../dtos/seller.dto.js';
import { makeSlug } from '../utils/slug.js';

export const createSellerProfile = async (data: CreateSellerDtoType) => {
  const slug = data.slug ?? makeSlug(data.displayName);
  const rec = await prisma.sellerProfile.create({
    data: {
      userId: data.userId,
      displayName: data.displayName,
      slug,
      about: data.about ?? null,
    },
  });
  return rec;
};

export const findSellerById = async (id: string) =>
  prisma.sellerProfile.findUnique({ where: { id } });

export const findSellerByUserId = async (userId: string) =>
  prisma.sellerProfile.findUnique({ where: { userId } });

export const updateSellerProfile = async (
  id: string,
  data: UpdateSellerDtoType,
) => {
  const prismaData: any = {};
  if (data.displayName !== undefined) prismaData.displayName = data.displayName;
  if (data.slug !== undefined) prismaData.slug = data.slug;
  if (data.about !== undefined) prismaData.about = data.about;
  return prisma.sellerProfile.update({ where: { id }, data: prismaData });
};

export const deleteSellerProfile = async (id: string) =>
  prisma.sellerProfile.delete({ where: { id } });
