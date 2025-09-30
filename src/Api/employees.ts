import { Router } from 'express';
import { EmployeeController } from './EmployeeController';
import { AuthMiddleware } from '../Infra/auth';
import { createEmployeeValidation, updateEmployeeValidation } from '../Domain/index';
import { validateRequest } from '../Infra/validation';

const router = Router();
const employeeController = new EmployeeController();
const authMiddleware = new AuthMiddleware();

router.use(authMiddleware.authenticate);

router.post('/', createEmployeeValidation, validateRequest, employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', updateEmployeeValidation, validateRequest, employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;
