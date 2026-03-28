import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token missing' });
    return;
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your_jwt_secret',
    (err, user) => {
      if (err) {
        res.status(403).json({ error: 'Invalid token' });
        return;
      }
      req.user = user;
      next();
    },
  );
};
