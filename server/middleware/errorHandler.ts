import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: err.statusCode,
        details: err.details,
      },
      err.message,
    );
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof ValidationError) {
    const details = err.errors.map((item) => item.message);
    logger.warn(
      { method: req.method, path: req.originalUrl, details },
      'Validation error',
    );
    res.status(400).json({ error: 'Validation error', details });
    return;
  }

  logger.error(
    {
      method: req.method,
      path: req.originalUrl,
      err,
    },
    'Unhandled server error',
  );

  res.status(500).json({ error: 'Internal server error' });
}
