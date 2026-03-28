import { Router, Request, Response } from 'express';
import Question from '../models/Question';

const router = Router();

router.get(
  '/template/:templateId',
  async (
    req: Request<{ templateId: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const questions = await Question.findAll({
        where: { templateId: req.params.templateId },
      });
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { templateId, title, description, type, order, showInTable } =
      req.body;
    const question = await Question.create({
      templateId,
      title,
      description,
      type,
      order,
      showInTable,
    });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const question = await Question.findByPk(req.params.id);
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }
      await question.update(req.body);
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

router.delete(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const question = await Question.findByPk(req.params.id);
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }
      await question.destroy();
      res.json({ message: 'Question deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
