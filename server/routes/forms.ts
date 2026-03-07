import { Router, Request, Response } from 'express';
import Form from '../models/Form';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const forms = await Form.findAll();
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userForms = await Form.findAll({ where: { userId: req.user.id } });
        res.json(userForms);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, templateId } = req.body;
        const form = await Form.create({ userId, templateId });
        res.json(form);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;