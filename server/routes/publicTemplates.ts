import { Router, Request, Response } from 'express';
import Template from '../models/Template';
import Question from '../models/Question';
import { logger } from '../utils/logger';
import { asyncHandler } from '../utils/asyncHandler';
import { idParamValidator } from '../validators/commonValidators';
import { validateRequest } from '../middleware/validateRequest';
import { AppError } from '../errors/AppError';
import { createResponseValidator } from '../validators/responseValidators';
import { createPublicResponseFromAnswers } from '../services/responseService';

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

router.get(
  '/:id',
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const template = await Template.findOne({
      where: { id: Number(req.params.id), isPublic: true },
      include: [{ model: Question, as: 'questions' }],
    });

    if (!template) {
      throw new AppError(404, 'Public template not found');
    }

    res.json(template);
  }),
);

router.post(
  '/:id/responses',
  idParamValidator('id'),
  createResponseValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const created = await createPublicResponseFromAnswers(
      Number(req.params.id),
      req.body.answers,
    );
    res.status(201).json(created);
  }),
);

export default router;
