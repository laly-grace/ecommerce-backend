import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ListCategoriesQuery,
} from '../dtos/category.dto.js';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();

router.post(
  '/',
  validateRequest(CreateCategoryDto),
  categoryController.createCategory,
);
router.get(
  '/',
  validateRequest(ListCategoriesQuery, { target: 'query' }),
  categoryController.listCategories,
);
router.get('/:id', categoryController.getCategory);
router.put(
  '/:id',
  validateRequest(UpdateCategoryDto),
  categoryController.updateCategory,
);
router.delete('/:id', categoryController.deleteCategory);

export default router;
