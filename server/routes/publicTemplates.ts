import { Router, Request, Response } from 'express';
import Template from '../models/Template';
import Question from '../models/Question';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const templates = await Template.findAll({
      where: { isPublic: true },
      include: [{ model: Question, as: 'questions' }],
    });
    res.json(templates);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
