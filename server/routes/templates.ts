import { Router, Response } from 'express';
import Template from '../models/Template';
import Question from '../models/Question';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeTemplateOwner } from '../middleware/auth';

const router = Router();

// GET /api/templates — все шаблоны (user — свои, admin — все)
router.get(
  '/',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const where = req.user.role === 'admin'
        ? {}
        : { userId: req.user.id };
      const templates = await Template.findAll({
        where,
        include: [{ model: Question, as: 'questions' }]
      });
      res.json(templates);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/templates/:id — один шаблон с вопросами
router.get(
  '/:id',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const template = await Template.findByPk(req.params.id, {
        include: [{ model: Question, as: 'questions' }]
      });
      if (!template) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }
      if (req.user.role !== 'admin' && template.userId !== req.user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      res.json(template);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /api/templates — создать шаблон вместе с вопросами
router.post(
  '/',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, topic, image, tags, isPublic, questions } = req.body;
      const tpl = await Template.create({
        title, description, topic, image, tags, isPublic, userId: req.user.id
      });
      if (Array.isArray(questions)) {
        await Promise.all(
          questions.map((q: any) =>
            Question.create({ ...q, templateId: tpl.id })
          )
        );
      }
      const created = await Template.findByPk(tpl.id, {
        include: [{ model: Question, as: 'questions' }]
      });
      res.json(created);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/templates/:id — обновить шаблон
router.put(
  '/:id',
  authenticateJWT,
  authorizeTemplateOwner,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tpl = await Template.findByPk(req.params.id);
      if (!tpl) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }
      await tpl.update(req.body);
      res.json(tpl);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/templates/:id — удалить шаблон + вопросы + ответы (cascade)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeTemplateOwner,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tpl = await Template.findByPk(req.params.id);
      if (!tpl) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }
      await tpl.destroy();
      res.json({ message: 'Template deleted' });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;