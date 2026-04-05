import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { asyncHandler } from '../utils/asyncHandler';
import { idParamValidator } from '../validators/commonValidators';
import { validateRequest } from '../middleware/validateRequest';
import { requireAnswerAccess, requireResponseAccess } from '../services/accessService';
import Answer from '../models/Answer';
import { body } from 'express-validator';

const router = Router();

router.get(
  '/response/:responseId',
  authenticateJWT,
  idParamValidator('responseId'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireResponseAccess(authReq, Number(req.params.responseId));
    const answers = await Answer.findAll({
      where: { responseId: Number(req.params.responseId) },
      include: ['question'],
    });
    res.json(answers);
  }),
);

router.get(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const answer = await requireAnswerAccess(authReq, Number(req.params.id));
    res.json(answer);
  }),
);

router.post(
  '/',
  authenticateJWT,
  body('responseId').isInt({ min: 1 }),
  body('questionId').isInt({ min: 1 }),
  body('value').isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireResponseAccess(authReq, Number(req.body.responseId));
    const answer = await Answer.create(req.body);
    res.status(201).json(answer);
  }),
);

router.put(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  body('value').isString(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const answer = await requireAnswerAccess(authReq, Number(req.params.id));
    await answer.update({ value: req.body.value });
    res.json(answer);
  }),
);

router.delete(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const answer = await requireAnswerAccess(authReq, Number(req.params.id));
    await answer.destroy();
    res.json({ message: 'Answer deleted' });
  }),
);

export default router;
