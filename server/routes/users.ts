import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { authorizeAdmin } from '../middleware/authorize';
import { asyncHandler } from '../utils/asyncHandler';
import {
  deleteUser,
  getProfile,
  listUsers,
  updateProfile,
  updateUserRole,
} from '../services/userService';
import { validateRequest } from '../middleware/validateRequest';
import { idParamValidator } from '../validators/commonValidators';
import { updateProfileValidator, updateRoleValidator } from '../validators/userValidators';

const router = Router();

router.get(
  '/me',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    res.json(await getProfile(authReq.user!.id));
  }),
);

router.put(
  '/me',
  authenticateJWT,
  updateProfileValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    res.json(await updateProfile(authReq.user!.id, req.body));
  }),
);

router.get(
  '/',
  authenticateJWT,
  authorizeAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await listUsers());
  }),
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeAdmin,
  idParamValidator('id'),
  updateRoleValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    res.json(await updateUserRole(Number(req.params.id), req.body.role));
  }),
);

router.delete(
  '/:id',
  authenticateJWT,
  authorizeAdmin,
  idParamValidator('id'),
  validateRequest,
  asyncHandler(async (req, res) => {
    await deleteUser(Number(req.params.id));
    res.json({ message: 'User deleted' });
  }),
);

export default router;
