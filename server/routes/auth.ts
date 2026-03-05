import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';

const router = Router();

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const { username, email, password } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: 'User already exists' });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, email, password: hashedPassword });
            res.json(user);
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/profile', authenticateJWT, (req: AuthRequest, res: Response): void => {
    res.json(req.user);
});

router.put('/profile', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const { username, email } = req.body;
        await user.update({ username, email });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/password', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Invalid old password' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;