import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, 'JWT_SECRET environment variable is required');
  }
  return secret;
}

export function signJwt(payload: object): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' });
}

export function verifyJwt(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, getJwtSecret());
}
