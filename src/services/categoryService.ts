import * as repo from '../repositories/categoryRepository.js';
import type {
  CreateCategoryDtoType,
  UpdateCategoryDtoType,
} from '../dtos/category.dto.js';

export const createCategory = async (data: CreateCategoryDtoType) =>
  repo.createCategory(data);

export const getCategoryById = async (id: string) => repo.findCategoryById(id);

export const listCategories = async (opts: {
  page: number;
  limit: number;
  q?: string;
  parentId?: string;
}) => repo.findCategories(opts);

export const updateCategory = async (id: string, data: UpdateCategoryDtoType) =>
  repo.updateCategory(id, data);

export const deleteCategory = async (id: string) => repo.deleteCategory(id);
