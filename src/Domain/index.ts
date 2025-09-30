import { Request } from 'express';
import { body } from 'express-validator';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  fullName: string;
  jobRole: string;
  department: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

// Interface que representa um usuário sem a senha (para retornos de API)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserWithoutPassword extends Omit<User, 'password'> {
  // Herda todos os campos de User exceto 'password'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface CreateEmployeeRequest {
  fullName: string;
  jobRole: string;
  department: string;
  contact: string;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  jobRole?: string;
  department?: string;
  contact?: string;
}

// Validações
export const createUserValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username deve ter entre 3 e 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username deve conter apenas letras, números e underscore')
    .notEmpty()
    .withMessage('Username é obrigatório'),
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Email deve ter formato válido (ex: usuario@dominio.com)')
    .notEmpty()
    .withMessage('Email é obrigatório'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role deve ser admin ou user')
];

export const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username é obrigatório'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

export const createEmployeeValidation = [
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome completo deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome completo deve conter apenas letras e espaços')
    .notEmpty()
    .withMessage('Nome completo é obrigatório'),
  body('jobRole')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cargo deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-.]+$/)
    .withMessage('Cargo deve conter apenas letras, espaços, hífens e pontos')
    .notEmpty()
    .withMessage('Cargo é obrigatório'),
  body('department')
    .isLength({ min: 2, max: 100 })
    .withMessage('Departamento deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-.]+$/)
    .withMessage('Departamento deve conter apenas letras, espaços, hífens e pontos')
    .notEmpty()
    .withMessage('Departamento é obrigatório'),
  body('contact')
    .isLength({ min: 5, max: 100 })
    .withMessage('Contato deve ter entre 5 e 100 caracteres')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Contato deve ser um email válido ou telefone (ex: +5511999999999)')
    .notEmpty()
    .withMessage('Contato é obrigatório')
];

export const updateEmployeeValidation = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome completo deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome completo deve conter apenas letras e espaços'),
  body('jobRole')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cargo deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-.]+$/)
    .withMessage('Cargo deve conter apenas letras, espaços, hífens e pontos'),
  body('department')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Departamento deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-.]+$/)
    .withMessage('Departamento deve conter apenas letras, espaços, hífens e pontos'),
  body('contact')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Contato deve ter entre 5 e 100 caracteres')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Contato deve ser um email válido ou telefone (ex: +5584999999999)')
];
