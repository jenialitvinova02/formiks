import { body } from 'express-validator';
import { USER_ROLES } from '../constants/roles';

export const updateProfileValidator = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
];

export const updateRoleValidator = [
  body('role').isIn(USER_ROLES).withMessage('Invalid role'),
];
