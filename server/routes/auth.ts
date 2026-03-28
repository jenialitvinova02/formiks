import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    console.log('Incoming request body:', req.body);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.warn('Validation errors:', validationErrors.array());
      res.status(400).json({ errors: validationErrors.array() });
      return;
    }

    try {
      const { username, email, password, role } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.warn('Registration failed: user already exists:', email);
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user',
      });

      console.log('User created:', user.toJSON());
      res.status(201).json(user);
    } catch (err: any) {
      console.error('Error during registration:', err.name, err.message, err.errors);
      if (
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
      ) {
        const details = err.errors.map((e: any) => e.message);
        res.status(400).json({ error: err.name, details });
      } else {
        res.status(500).json({ error: 'Internal server error', message: err.message });
      }
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