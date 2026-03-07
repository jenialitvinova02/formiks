import { Router, Request, Response } from 'express';
import Form from '../models/Form';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeFormOwner } from '../middleware/authorize'; 

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

router.post('/', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, questions } = req.body;
        const form = await Form.create({ title, description, questions, userId: req.user.id });
        res.json(form);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', authenticateJWT, authorizeFormOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const form = await Form.findByPk(req.params.id);
        if (!form) {
            res.status(404).json({ error: 'Form not found' });
            return;
        }
        await form.update(req.body);
        res.json(form);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', authenticateJWT, authorizeFormOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const form = await Form.findByPk(req.params.id);
        if (!form) {
            res.status(404).json({ error: 'Form not found' });
            return;
        }
        await form.destroy();
        res.json({ message: 'Form deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;