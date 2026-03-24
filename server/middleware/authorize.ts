import { Request, Response, NextFunction } from 'express';
import Form from '../models/Response';
import { AuthRequest } from './authenticateJWT';

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied, admin only' });
    }
};

export const authorizeResponseOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const form = await Form.findByPk(req.params.id);
    if (!form) {
        res.status(404).json({ error: 'Form not found' });
        return;
    }
    if (req.user.role === 'admin' || form.get('userId') === req.user.id) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};