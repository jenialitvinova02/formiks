import { Router, Request, Response } from 'express';
import User from '../models/User';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeAdmin } from '../middleware/authorize';

const router = Router();

router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/me', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await user.update({ username: req.body.username, email: req.body.email });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', authenticateJWT, authorizeAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;