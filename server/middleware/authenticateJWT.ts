import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { verifyJwt } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new AppError(401, 'Token missing'));
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    next(new AppError(401, 'Bearer token is required'));
    return;
  }

  try {
    req.user = verifyJwt(token) as AuthRequest['user'];
    next();
  } catch {
    next(new AppError(403, 'Invalid token'));
  }
};
