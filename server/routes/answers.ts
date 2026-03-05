import { Router, Request, Response } from 'express';
import Answer from '../models/Answer';

const router = Router();

router.get('/form/:formId', async (req: Request<{ formId: string }>, res: Response): Promise<void> => {
    try {
        const answers = await Answer.findAll({
            where: { formId: req.params.formId },
        });
        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { formId, questionId, value } = req.body;
        const answer = await Answer.create({ formId, questionId, value });
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const answer = await Answer.findByPk(req.params.id);
        if (!answer) {
            res.status(404).json({ error: 'Answer not found' });
            return;
        }
        await answer.update(req.body);
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const answer = await Answer.findByPk(req.params.id);
        if (!answer) {
            res.status(404).json({ error: 'Answer not found' });
            return;
        }
        await answer.destroy();
        res.json({ message: 'Answer deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;