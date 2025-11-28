import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { CreateUserDto } from '../dtos/user.dto.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.post('/', validateRequest(CreateUserDto), userController.createUser);
router.get('/:id', userController.getUser);

export default router;
