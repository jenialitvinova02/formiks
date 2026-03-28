import { Request, Response, NextFunction } from 'express';
import Template from '../models/Template';
import { AuthRequest } from './authenticateJWT';

export const authorizeTemplateOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  if (req.user.role === 'admin' || template.get('userId') === req.user.id) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};
