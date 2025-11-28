import { prisma } from '../db/prisma.js';
import type {
  CreateCategoryDtoType,
  UpdateCategoryDtoType,
} from '../dtos/category.dto.js';
import { makeSlug } from '../utils/slug.js';

export const createCategory = async (data: CreateCategoryDtoType) => {
  const slug = data.slug ?? makeSlug(data.name);
  const rec = await prisma.category.create({
    data: { name: data.name, slug, parentId: data.parentId ?? null },
  });
  return rec;
};

export const findCategoryById = async (id: string) =>
  prisma.category.findUnique({ where: { id } });

export const findCategories = async (opts: {
  page: number;
  limit: number;
  q?: string;
  parentId?: string;
}) => {
  const where: any = {};
  if (opts.q)
    where.OR = [{ name: { contains: opts.q } }, { slug: { contains: opts.q } }];
  if (opts.parentId) where.parentId = opts.parentId;
  const skip = (opts.page - 1) * opts.limit;
  const [total, items] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      take: opts.limit,
      skip,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { total, items };
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryDtoType,
) => {
  const prismaData: any = {};
  if (data.name !== undefined) prismaData.name = data.name;
  if (data.slug !== undefined) prismaData.slug = data.slug;
  if (data.parentId !== undefined) prismaData.parentId = data.parentId ?? null;
  return prisma.category.update({ where: { id }, data: prismaData });
};

export const deleteCategory = async (id: string) =>
  prisma.category.delete({ where: { id } });
