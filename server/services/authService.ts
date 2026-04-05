import bcrypt from 'bcrypt';
import User from '../models/User';
import { ROLE_USER } from '../constants/roles';
import { AppError } from '../errors/AppError';
import { serializeUser } from '../utils/serializers';
import { signJwt } from '../utils/jwt';

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
}) {
  const existingUser = await User.findOne({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError(409, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    role: ROLE_USER,
  });

  return serializeUser(user);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ where: { email: payload.email } });
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.password);
  if (!isValidPassword) {
    throw new AppError(401, 'Invalid credentials');
  }

  return {
    token: signJwt({ id: user.id, email: user.email, role: user.role }),
    user: serializeUser(user),
  };
}
