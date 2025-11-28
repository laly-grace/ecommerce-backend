import { prisma } from '../db/prisma.js';
import type {
  CreateVendorDtoType,
  UpdateVendorDtoType,
} from '../dtos/vendor.dto.js';
import { makeSlug } from '../utils/slug.js';

export const createVendor = async (data: CreateVendorDtoType) => {
  const slug = data.slug ?? makeSlug(data.name);
  const rec = await prisma.vendor.create({
    data: {
      sellerId: data.sellerId,
      name: data.name,
      slug,
      description: data.description ?? null,
      logoUrl: data.logoUrl ?? null,
    },
  });
  return rec;
};

export const findVendorById = async (id: string) =>
  prisma.vendor.findUnique({ where: { id } });

export const findVendors = async () =>
  prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } });

export const updateVendor = async (id: string, data: UpdateVendorDtoType) => {
  const prismaData: any = {};
  if (data.name !== undefined) prismaData.name = data.name;
  if (data.slug !== undefined) prismaData.slug = data.slug;
  if (data.description !== undefined) prismaData.description = data.description;
  if (data.logoUrl !== undefined) prismaData.logoUrl = data.logoUrl;
  return prisma.vendor.update({ where: { id }, data: prismaData });
};

export const deleteVendor = async (id: string) =>
  prisma.vendor.delete({ where: { id } });
