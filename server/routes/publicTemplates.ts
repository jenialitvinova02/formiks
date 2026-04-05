import { Router, Request, Response } from 'express';
import Template from '../models/Template';
import Question from '../models/Question';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const templates = await Template.findAll({
      where: { isPublic: true },
      include: [{ model: Question, as: 'questions' }],
    });
    res.json(templates);
  } catch (e: any) {
    logger.error({ err: e }, 'Failed to load public templates');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
