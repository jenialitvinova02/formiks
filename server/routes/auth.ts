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
        console.log('Incoming request body:', req.body); 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); 
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const { username, email, password, role } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log('User already exists:', email); 
                res.status(400).json({ error: 'User already exists' });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                role: role === 'admin' ? 'admin' : 'user', 
            });
            console.log('User created:', user); 
            res.json(user);
        } catch (e) {
            console.error('Error during registration:', e); 
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

export default router;