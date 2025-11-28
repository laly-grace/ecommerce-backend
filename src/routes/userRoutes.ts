import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { CreateUserDto } from '../dtos/user.dto.js';
import { idParamsSchema } from '../dtos/common.dto.js';
import * as userController from '../controllers/userController.js';
import { ListUsersQuery, UpdateUserDto } from '../dtos/user.dto.js';

const router = Router();

router.post('/', validateRequest(CreateUserDto), userController.createUser);
router.get(
  '/',
  validateRequest(ListUsersQuery, { target: 'query' }),
  userController.listUsers,
);
router.get(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  userController.getUser,
);
router.put(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  validateRequest(UpdateUserDto),
  userController.updateUser,
);
router.delete(
  '/:id',
  validateRequest(idParamsSchema, { target: 'params' }),
  userController.deleteUser,
);

export default router;
