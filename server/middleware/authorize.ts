import { Response, NextFunction } from 'express';
import Form from '../models/Response';
import { ROLE_ADMIN } from '../constants/roles';
import { AppError } from '../errors/AppError';
import { AuthRequest } from './authenticateJWT';

export const authorizeAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user && req.user.role === ROLE_ADMIN) {
    next();
  } else {
    next(new AppError(403, 'Access denied, admin only'));
  }
};

export const authorizeResponseOwner = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const form = await Form.findByPk(req.params.id);
  if (!form) {
    next(new AppError(404, 'Response not found'));
    return;
  }
  if (req.user?.role === ROLE_ADMIN || form.get('userId') === req.user?.id) {
    next();
  } else {
    next(new AppError(403, 'Access denied'));
  }
};
