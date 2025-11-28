import { z } from 'zod';
import { idSchema, paginationSchema } from './common.dto.js';
import { makeSlug } from '../utils/slug.js';

export const CreateCategoryDto = z
  .object({
    name: z.string().min(1).max(200),
    slug: z.string().optional(),
    parentId: idSchema.optional(),
  })
  .strict();

export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDto>;

export const UpdateCategoryDto = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().optional(),
    parentId: idSchema.nullable().optional(),
  })
  .strict();

export type UpdateCategoryDtoType = z.infer<typeof UpdateCategoryDto>;

export const ListCategoriesQuery = paginationSchema.extend({
  q: z.string().optional(),
  parentId: idSchema.optional(),
});

export type ListCategoriesQueryType = z.infer<typeof ListCategoriesQuery>;
