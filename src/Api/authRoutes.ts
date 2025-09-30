import { Router } from 'express';
import { AuthController } from './AuthController';
import { createUserValidation, loginValidation } from '../Domain/index';
import { validateRequest } from '../Infra/validation';

const router = Router();
const authController = new AuthController();

router.post('/register', createUserValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

export default router;
