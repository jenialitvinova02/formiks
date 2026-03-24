import { Router, Request, Response } from 'express';
import Answer from '../models/Answer';
import { authenticateJWT } from '../middleware/authenticateJWT';

const router = Router();

// GET /api/answers/response/:responseId — все ответы по форме
router.get(
  '/response/:responseId',
  authenticateJWT,
  async (req: Request<{ responseId: string }>, res: Response): Promise<void> => {
    try {
      const responseId = Number(req.params.responseId);
      const answers = await Answer.findAll({
        where: { responseId },
        include: ['question']
      });
      res.json(answers);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/answers/:id — один ответ
router.get(
  '/:id',
  authenticateJWT,
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const ans = await Answer.findByPk(req.params.id);
      if (!ans) {
        res.status(404).json({ error: 'Answer not found' });
        return;
      }
      res.json(ans);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /api/answers — добавить вручную
router.post(
  '/',
  authenticateJWT,
  async (
    req: Request<{}, {}, { responseId: number; questionId: number; value: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const { responseId, questionId, value } = req.body;
      const ans = await Answer.create({ responseId, questionId, value });
      res.json(ans);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/answers/:id — обновить
router.put(
  '/:id',
  authenticateJWT,
  async (
    req: Request<{ id: string }, {}, { value: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const ans = await Answer.findByPk(req.params.id);
      if (!ans) {
        res.status(404).json({ error: 'Answer not found' });
        return;
      }
      await ans.update(req.body);
      res.json(ans);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/answers/:id — удалить
router.delete(
  '/:id',
  authenticateJWT,
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const ans = await Answer.findByPk(req.params.id);
      if (!ans) {
        res.status(404).json({ error: 'Answer not found' });
        return;
      }
      await ans.destroy();
      res.json({ message: 'Answer deleted' });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;