import { body } from 'express-validator';

const questionValidator = body('questions')
  .optional()
  .isArray()
  .withMessage('Questions must be an array');

export const templatePayloadValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('tags').optional().isString(),
  body('image').optional().isString(),
  body('isPublic').optional().isBoolean(),
  questionValidator,
  body('questions.*.title').optional().trim().isLength({ min: 2 }),
  body('questions.*.description').optional().isString(),
  body('questions.*.type')
    .optional()
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
  body('questions.*.options').optional().isArray(),
  body('questions.*.options.*').optional().isString(),
  body('questions.*.correctAnswer').optional().isString(),
];
