import { Router, Response } from 'express';
import Template from '../models/Template';
import Question from '../models/Question';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeTemplateOwner } from '../middleware/auth';

const router = Router();

router.get(
  '/',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
      const templates = await Template.findAll({
        where,
        include: [{ model: Question, as: 'questions' }],
      });
      res.json(templates);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

router.get(
  '/:id',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const template = await Template.findByPk(req.params.id, {
        include: [{ model: Question, as: 'questions' }],
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
  },
);

router.post(
  '/',
  authenticateJWT,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('[templates POST] Получены данные:', req.body);
      const { title, description, topic, image, tags, isPublic, questions } =
        req.body;

      const tpl = await Template.create({
        title,
        description,
        topic,
        image,
        tags,
        isPublic,
        userId: req.user.id,
      });

      if (Array.isArray(questions)) {
        for (const q of questions) {
          try {
            await Question.create({ ...q, templateId: tpl.id });
          } catch (qError: any) {
            console.error(
              '[templates POST] Ошибка при создании вопроса:',
              q,
              qError.message,
            );
          }
        }
      }

      const created = await Template.findByPk(tpl.id, {
        include: [{ model: Question, as: 'questions' }],
      });
      res.json(created);
    } catch (e: any) {
      console.error('[templates POST] Ошибка при создании шаблона:', e.message);
      res
        .status(500)
        .json({ error: 'Internal server error', message: e.message });
    }
  },
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeTemplateOwner,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tpl = await Template.findByPk(req.params.id, {
        include: [{ model: Question, as: 'questions' }],
      });
      if (!tpl) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }

      const { title, description, topic, image, tags, isPublic, questions } =
        req.body;

      await tpl.update({ title, description, topic, image, tags, isPublic });

      await Question.destroy({ where: { templateId: tpl.id } });
      if (Array.isArray(questions)) {
        for (const q of questions) {
          await Question.create({ ...q, templateId: tpl.id });
        }
      }

      const updatedTemplate = await Template.findByPk(tpl.id, {
        include: [{ model: Question, as: 'questions' }],
      });
      res.json(updatedTemplate);
    } catch (e: any) {
      console.error(e);
      res
        .status(500)
        .json({ error: 'Internal server error', message: e.message });
    }
  },
);

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
  },
);

export default router;
