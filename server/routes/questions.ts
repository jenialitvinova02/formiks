import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { asyncHandler } from '../utils/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { idParamValidator } from '../validators/commonValidators';
import { questionPayloadValidator } from '../validators/questionValidators';
import { createQuestion, listQuestionsForTemplate } from '../services/questionService';
import { requireTemplateAccess } from '../services/accessService';
import Question from '../models/Question';
import { AppError } from '../errors/AppError';

const router = Router();

router.get(
  '/template/:templateId',
  authenticateJWT,
  idParamValidator('templateId'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireTemplateAccess(authReq, Number(req.params.templateId), {
      allowPublic: true,
    });
    const questions = await listQuestionsForTemplate(Number(req.params.templateId));
    res.json(questions);
  }),
);

router.post(
  '/',
  authenticateJWT,
  questionPayloadValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireTemplateAccess(authReq, Number(req.body.templateId));
    const question = await createQuestion(req.body);
    res.status(201).json(question);
  }),
);

router.put(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  questionPayloadValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const question = await Question.findByPk(Number(req.params.id));
    if (!question) {
      throw new AppError(404, 'Question not found');
    }
    await requireTemplateAccess(authReq, Number(question.templateId));
    await question.update(req.body);
    res.json(question);
  }),
);

router.delete(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const question = await Question.findByPk(Number(req.params.id));
    if (!question) {
      throw new AppError(404, 'Question not found');
    }
    await requireTemplateAccess(authReq, Number(question.templateId));
    await question.destroy();
    res.json({ message: 'Question deleted' });
  }),
);

export default router;
