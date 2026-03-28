import { Router, Request, Response } from 'express';
import User from '../models/User';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeAdmin } from '../middleware/authorize';

const router = Router();

router.get(
  '/me',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
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
  },
);

router.put(
  '/me',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
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
  },
);

router.get(
  '/',
  authenticateJWT,
  authorizeAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      await user.update({ role: req.body.role });
      res.json(user);
    } catch (e: any) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: e.message });
    }
  },
);

router.delete(
  '/:id',
  authenticateJWT,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (e: any) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: e.message });
    }
  },
);

export default router;
