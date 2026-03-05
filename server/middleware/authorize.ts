import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authenticateJWT';

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied, admin only' });
    }
};