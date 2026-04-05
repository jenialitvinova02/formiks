import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../errors/AppError';

export function validateRequest(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new AppError(400, 'Validation failed', errors.array()));
    return;
  }
  next();
}
