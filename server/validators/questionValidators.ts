import { body } from 'express-validator';

export const questionPayloadValidator = [
  body('templateId').optional().isInt({ min: 1 }),
  body('title').trim().notEmpty().withMessage('Question title is required'),
  body('description').optional().isString(),
  body('type')
    .trim()
    .isIn([
      'text',
      'textarea',
      'number',
      'checkbox',
      'single-line',
      'multi-line',
      'integer',
      'single-choice',
      'multiple-choice',
    ])
    .withMessage('Unsupported question type'),
  body('options').optional().isArray(),
  body('options.*').optional().isString(),
  body('correctAnswer').optional().isString(),
  body('order').optional().isInt({ min: 0 }),
  body('showInTable').optional().isBoolean(),
];
