import { Router, Request, Response } from 'express';
import Template from '../models/Template';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeTemplateOwner } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const templates = await Template.findAll();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, topic, image, tags, isPublic } = req.body;
        const template = await Template.create({ title, description, topic, image, tags, isPublic, userId: req.user.id });
        res.json(template);
    } catch (error: any) {
        console.error('Error creating template:', error.message, error.stack);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template) {
            res.status(404).json({ error: 'Template not found' });
            return;
        }
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', authenticateJWT, authorizeTemplateOwner, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template) {
            res.status(404).json({ error: 'Template not found' });
            return;
        }
        await template.update(req.body);
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const template = await Template.findByPk(req.params.id);
        if (!template) {
            res.status(404).json({ error: 'Template not found' });
            return;
        }
        await template.destroy();
        res.json({ message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;