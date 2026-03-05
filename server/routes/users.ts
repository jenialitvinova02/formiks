import { Router, Request, Response } from 'express';
import User from '../models/User';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeAdmin } from '../middleware/authorize';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await user.update(req.body);
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', authenticateJWT, authorizeAdmin, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;