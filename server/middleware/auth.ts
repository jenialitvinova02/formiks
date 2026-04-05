import { Response, NextFunction } from 'express';
import Template from '../models/Template';
import { ROLE_ADMIN } from '../constants/roles';
import { AppError } from '../errors/AppError';
import { AuthRequest } from './authenticateJWT';

export const authorizeTemplateOwner = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) {
    next(new AppError(404, 'Template not found'));
    return;
  }
  if (req.user?.role === ROLE_ADMIN || template.get('userId') === req.user?.id) {
    next();
  } else {
    next(new AppError(403, 'Access denied'));
  }
};
