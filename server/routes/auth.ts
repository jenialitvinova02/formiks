import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { loginValidator, registerValidator } from '../validators/authValidators';
import { loginUser, registerUser } from '../services/authService';

const router = Router();

router.post(
  '/register',
  registerValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  }),
);

router.post(
  '/login',
  loginValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  }),
);

export default router;
