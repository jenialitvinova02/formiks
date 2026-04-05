import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { asyncHandler } from '../utils/asyncHandler';
import { authorizeAdmin } from '../middleware/authorize';
import {
  createResponseFromAnswers,
  getResponseWithAnswers,
  listAllResponses,
  listResponsesForTemplate,
  listResponsesForUser,
} from '../services/responseService';
import { requireResponseAccess, requireTemplateAccess } from '../services/accessService';
import { createResponseValidator } from '../validators/responseValidators';
import { idParamValidator } from '../validators/commonValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get(
  '/',
  authenticateJWT,
  authorizeAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await listAllResponses());
  }),
);

router.get(
  '/user',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    res.json(await listResponsesForUser(authReq.user!.id));
  }),
);

router.get(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireResponseAccess(authReq, Number(req.params.id));
    const response = await getResponseWithAnswers(Number(req.params.id));
    res.json(response);
  }),
);

router.post(
  '/from-template/:templateId',
  authenticateJWT,
  idParamValidator('templateId'),
  createResponseValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireTemplateAccess(authReq, Number(req.params.templateId), {
      allowPublic: true,
    });
    const created = await createResponseFromAnswers(
      authReq.user!.id,
      Number(req.params.templateId),
      req.body.answers,
    );
    res.status(201).json(created);
  }),
);

router.get(
  '/template/:templateId',
  authenticateJWT,
  idParamValidator('templateId'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireTemplateAccess(authReq, Number(req.params.templateId));
    res.json(await listResponsesForTemplate(Number(req.params.templateId)));
  }),
);

router.delete(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const response = await requireResponseAccess(authReq, Number(req.params.id));
    await response.destroy();
    res.json({ message: 'Response deleted' });
  }),
);

export default router;
