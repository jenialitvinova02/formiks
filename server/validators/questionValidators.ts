import { body } from 'express-validator';

export const questionPayloadValidator = [
  body('templateId').optional().isInt({ min: 1 }),
  body('title').trim().notEmpty().withMessage('Question title is required'),
  body('description').optional().isString(),
  body('type').trim().notEmpty().withMessage('Question type is required'),
  body('order').optional().isInt({ min: 0 }),
  body('showInTable').optional().isBoolean(),
];
