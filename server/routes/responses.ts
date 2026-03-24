import { Router, Request, Response as ExResponse } from 'express';
import Template from '../models/Template';
import Question from '../models/Question';
import ResponseModel from '../models/Response';
import Answer from '../models/Answer';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeResponseOwner } from '../middleware/authorize';

const router = Router();

// GET /api/responses — все пройденные (admin)
router.get(
  '/',
  authenticateJWT,
  async (req: AuthRequest, res: ExResponse): Promise<void> => {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      const all = await ResponseModel.findAll({ include: ['template', 'user'] });
      res.json(all);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/responses/user — свои (user/admin)
router.get(
  '/user',
  authenticateJWT,
  async (req: AuthRequest, res: ExResponse): Promise<void> => {
    try {
      const list = await ResponseModel.findAll({
        where: { userId: req.user.id },
        include: ['template']
      });
      res.json(list);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/responses/:id — детали (включая answers)
router.get(
  '/:id',
  authenticateJWT,
  authorizeResponseOwner,
  async (req: AuthRequest, res: ExResponse): Promise<void> => {
    try {
      const resp = await ResponseModel.findByPk(req.params.id, {
        include: [
          { model: Answer, as: 'answers', include: ['question'] },
          'template'
        ]
      });
      if (!resp) {
        res.status(404).json({ error: 'Response not found' });
        return;
      }
      res.json(resp);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /api/responses/from-template/:templateId — пройти шаблон
router.post(
  '/from-template/:templateId',
  authenticateJWT,
  async (req: AuthRequest, res: ExResponse): Promise<void> => {
    try {
      const { templateId } = req.params;
      const { answers } = req.body;
      const tpl = await Template.findByPk(templateId, { include: ['questions'] });
      if (!tpl) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }
      const resp = await ResponseModel.create({
        templateId: Number(templateId),
        userId: req.user.id
      });
      const created = await Promise.all(
        Object.entries(answers).map(([qid, val]) =>
          Answer.create({
            responseId: resp.id,
            questionId: Number(qid),
            value: String(val)
          })
        )
      );
      res.json({ response: resp, answers: created });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/responses/template/:templateId — все ответившие на этот шаблон
router.get(
  '/template/:templateId',
  authenticateJWT,
  async (req: AuthRequest, res: ExResponse): Promise<void> => {
    try {
      const templateId = Number(req.params.templateId);
      const list = await ResponseModel.findAll({
        where: { templateId },
        include: [{ model: Answer, as: 'answers' }]
      });
      res.json(list);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/responses/:id — удалить свою/любую (admin)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeResponseOwner,
  async (req: AuthRequest, res: ExResponse): Promise<void> => {
    try {
      const resp = await ResponseModel.findByPk(req.params.id);
      if (!resp) {
        res.status(404).json({ error: 'Response not found' });
        return;
      }
      await resp.destroy();
      res.json({ message: 'Response deleted' });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;