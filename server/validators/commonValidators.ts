import { param } from 'express-validator';

export const idParamValidator = (field: string) =>
  param(field).isInt({ min: 1 }).withMessage(`${field} must be a positive integer`);
