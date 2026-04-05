import { body } from 'express-validator';

export const createResponseValidator = [
  body('answers')
    .isObject()
    .withMessage('Answers payload must be an object keyed by question id'),
];
