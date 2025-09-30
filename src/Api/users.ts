import { Router } from 'express';
import { UserController } from './UserController';
import { AuthMiddleware } from '../Infra/auth';

const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

router.get('/', authMiddleware.authenticate, authMiddleware.requireAdmin, userController.getAllUsers);
router.get('/:id', authMiddleware.authenticate, authMiddleware.requireAdmin, userController.getUserById);

export default router;
