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
];
