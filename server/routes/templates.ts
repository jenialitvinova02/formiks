import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { asyncHandler } from '../utils/asyncHandler';
import { requireTemplateAccess } from '../services/accessService';
import {
  createTemplateWithQuestions,
  getTemplateWithQuestions,
  listTemplatesForUser,
  updateTemplateWithQuestions,
} from '../services/templateService';
import { AppError } from '../errors/AppError';
import { templatePayloadValidator } from '../validators/templateValidators';
import { validateRequest } from '../middleware/validateRequest';
import { idParamValidator } from '../validators/commonValidators';
import Template from '../models/Template';

const router = Router();

router.get(
  '/',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const templates = await listTemplatesForUser((req as AuthRequest).user!);
    res.json(templates);
  }),
);

router.get(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    await requireTemplateAccess(authReq, Number(req.params.id));
    const template = await getTemplateWithQuestions(Number(req.params.id));
    if (!template) {
      throw new AppError(404, 'Template not found');
    }
    res.json(template);
  }),
);

router.post(
  '/',
  authenticateJWT,
  templatePayloadValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const created = await createTemplateWithQuestions(authReq.user!.id, req.body);
    res.status(201).json(created);
  }),
);

router.put(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  templatePayloadValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const template = await requireTemplateAccess(authReq, Number(req.params.id));
    const updated = await updateTemplateWithQuestions(template, req.body);
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  authenticateJWT,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const template = await requireTemplateAccess(authReq, Number(req.params.id));
    await Template.destroy({ where: { id: template.id } });
    res.status(200).json({ message: 'Template deleted' });
  }),
);

export default router;
